package com.gruppe7.utils.GenerateGroup

import com.google.ortools.graph.MaxFlow
import com.gruppe7.utils.enums.Nodes
import com.gruppe7.utils.types.Edge
import com.gruppe7.utils.types.FilterInformation
import com.gruppe7.utils.types.Participant
import utils.types.GroupNode
import utils.types.Node
import utils.types.RegularNode
import utils.types.StudyProgramNode
import kotlin.math.abs

class FlowNetwork {

    fun solveWithMaximumFlow(
        participantList: ArrayList<Participant>,
        filterInformation: ArrayList<FilterInformation>
    ): Pair<Int, ArrayList<ArrayList<Participant>>> {

        val solutions = ArrayList<Pair<Int, ArrayList<ArrayList<Participant>>>>()

        var groupCount = 1

        while (groupCount <= participantList.size) {

            val reducedProblem = reduceToMaximumFlowProblem(participantList, filterInformation, groupCount)

            val edges = reducedProblem.first
            val nodes = reducedProblem.second

            val source = nodes.find { it.name == Nodes.SOURCE.name }
            val sink = nodes.find { it.name == Nodes.NEWSINK.name }

            val resultFromSolver = solveWithLinearProgramming(participantList, nodes, edges, source!!, sink!!)
            solutions.add(resultFromSolver)
            if (resultFromSolver.first == 0) {
                break
            }
            groupCount++
        }
        return solutions.minByOrNull { it.first }!!
    }

    private fun solveWithLinearProgramming(participantList: ArrayList<Participant>, nodes: ArrayList<Node>, edges: ArrayList<Edge>, source: Node, sink: Node): Pair<Int, ArrayList<ArrayList<Participant>>> {
        var maxFlow = MaxFlow()

        for (edge in edges) {
            maxFlow.addArcWithCapacity(edge.from.position, edge.to.position, edge.capacity.toLong())
        }

        maxFlow.solve(source.position, sink.position)

        for (edge in edges) {
            for (i in 0 until maxFlow.numArcs) {
                if (edge.from.position == maxFlow.getTail(i) && edge.to.position == maxFlow.getHead(i)) {
                    edge.flow = maxFlow.getFlow(i)
                }
            }
        }

        val score = calculateGroupsScore(arrayListOf(edges))
        val generatedGroups = generateGroupsForLinearProgramming(participantList, nodes, edges, maxFlow)

        return Pair(score.toInt(), generatedGroups)
    }

    private fun solveWithFordFulkerson(participantList: ArrayList<Participant>, nodes: ArrayList<Node>, edges: ArrayList<Edge>, source: Node, sink: Node, groupCount: Int): Pair<Int, ArrayList<ArrayList<Participant>>> {
        val solver = FordFulkerson.FordFulkersonDfsSolver(nodes.size, source.position, sink.position)

        for (edge in edges) {
            solver.addEdge(edge.from, edge.to, edge.capacity, edge.lowerBound)
        }

        val resultGraph = solver.getGraph()

        val score = calculateGroupsScore(resultGraph)
        val generatedGroups = generateGroupsForFordFolkerson(participantList, groupCount, resultGraph)
        return Pair(score.toInt(), generatedGroups)
    }

    private fun calculateGroupsScore(resultGraph: ArrayList<ArrayList<Edge>>): Long {
        var flowToSink: Long = 0
        var capacityToSink: Long = 0
        for (edges in resultGraph) {
            for (edge in edges) {
                if (edge.to.name == Nodes.NEWSINK.name) {
                    flowToSink += edge.flow
                    capacityToSink += edge.capacity
                }
            }
        }
        return abs(flowToSink - capacityToSink)
    }

    private fun generateGroupsForLinearProgramming(participantList: ArrayList<Participant>, nodes: ArrayList<Node>, edges: ArrayList<Edge>, maxFlow: MaxFlow): ArrayList<ArrayList<Participant>> {
        val generatedGroups: ArrayList<ArrayList<Participant>> = ArrayList()
        val clonedParticipantList = ArrayList<Participant>()
        for (participant in participantList) {
            clonedParticipantList.add(participant)
        }

        for (groupNode in nodes.filterIsInstance<GroupNode>()) {
            val group = ArrayList<Participant>()
            val edgesToGroupNode = edges.filter { it.to.position == groupNode.position }
            for (edge in edgesToGroupNode) {
                for (i in 0 until maxFlow.numArcs) {
                    if (maxFlow.getTail(i) == edge.from.position && maxFlow.getHead(i) == edge.to.position) {
                        val participantsInGroup = clonedParticipantList.filter { it.group == edge.from.name }
                        for (participantIndex in 0 until (edge.lowerBound + maxFlow.getFlow(i).toInt())) {
                            if (participantIndex < participantsInGroup.size) {
                                group.add(participantsInGroup.get(participantIndex))
                                clonedParticipantList.remove(participantsInGroup.get(participantIndex))
                            }
                        }
                        break
                    }
                }
            }
            generatedGroups.add(group)
        }

        return generatedGroups
    }

    private fun generateGroupsForFordFolkerson(participantList: ArrayList<Participant>, groupCount: Int, resultGraph: ArrayList<ArrayList<Edge>>): ArrayList<ArrayList<Participant>> {
        val generatedGroups: ArrayList<ArrayList<Participant>> = ArrayList()
        val clonedParticipantList = ArrayList<Participant>()
        for (participant in participantList) {
            clonedParticipantList.add(participant)
        }

        for (i in 0 until groupCount) {
            generatedGroups.add(ArrayList())
        }
        for (edges in resultGraph) {
            var groupIndex = 0
            for (edge in edges) {
                if (edge.from is StudyProgramNode && edge.to is GroupNode) {
                    val studentsPerStudyProgram = edge.flow + edge.lowerBound
                    for (i in 0 until studentsPerStudyProgram) {
                        val participant = clonedParticipantList.find { it.group == edge.from.name }
                        if (participant != null) {
                            generatedGroups[groupIndex].add(participant)
                        }
                        clonedParticipantList.remove(participant)
                    }
                    groupIndex++
                }
            }
        }
        for (participant in clonedParticipantList) {
            generatedGroups.minByOrNull { it.size }!!.add(participant)
        }
        return generatedGroups
    }

    private fun reduceToMaximumFlowProblem(
        participantList: ArrayList<Participant>,
        filterInformation: ArrayList<FilterInformation>,
        groupCount: Int
    ): Pair<ArrayList<Edge>, ArrayList<Node>> {

        val mapStudy = getCountPerStudy(participantList)

        val nodes: ArrayList<Node> = ArrayList()
        val edges: ArrayList<Edge> = ArrayList()
        val specialNodesCount = 3

        val filterGroupCount = filterInformation.size - 1
        val nodeCount = filterGroupCount + groupCount + specialNodesCount

        val source = RegularNode(nodeCount - 2, name = Nodes.SOURCE.name)
        val sink = RegularNode(nodeCount - 3, name = Nodes.SINK.name)
        val newSink = RegularNode(nodeCount - 1, name = Nodes.NEWSINK.name)
        var startIndex = 0
        nodes.add(source)
        nodes.add(sink)
        nodes.add(newSink)

        for (filter in filterInformation.subList(1, filterInformation.size)) {
            nodes.add(StudyProgramNode(startIndex, 0, filter.name!!))
            startIndex++
        }

        for (i in 0 until groupCount) {
            nodes.add(GroupNode(startIndex, 0, "Group${i + 1}"))
            startIndex++
        }

        for (node in nodes) {
            if (node.position == source.position) {
                for (studyNode in nodes.filterIsInstance<StudyProgramNode>()) {
                    val studyNodeInfo = filterInformation.find { it.name == studyNode.name }
                    val calculatedCapacity = mapStudy[studyNode.name]!! - (studyNodeInfo!!.minimum * groupCount)
                    if (calculatedCapacity > 0) {
                        edges.add(Edge(source, studyNode, abs(calculatedCapacity.toLong()), 0, abs(calculatedCapacity)))
                    }
                    if (calculatedCapacity < 0) {
                        edges.add(Edge(studyNode, newSink, abs(calculatedCapacity.toLong()), 0, abs(calculatedCapacity)))
                    }
                }
                val calculatedCapacity = abs(0 - groupCount * filterInformation.find { it.name == null }!!.minimum)
                edges.add(Edge(source, sink, calculatedCapacity.toLong(), 0, calculatedCapacity))
            }
            if (node is StudyProgramNode) {
                for (groupNode in nodes.filterIsInstance<GroupNode>()) {
                    val studyNodeInfo = filterInformation.find { it.name == node.name }
                    edges.add(
                        Edge(
                            node,
                            groupNode,
                            (studyNodeInfo!!.maximum - studyNodeInfo.minimum).toLong(),
                            studyNodeInfo.minimum,
                            studyNodeInfo.maximum
                        )
                    )
                }
            }
            if (node is GroupNode) {
                val generalFilterInfo = filterInformation.find { it.name == null }

                edges.add(
                    Edge(
                        node,
                        sink,
                        (generalFilterInfo!!.maximum - generalFilterInfo.minimum).toLong(),
                        generalFilterInfo.minimum,
                        generalFilterInfo.maximum
                    )
                )
                val lowerBoundInToNode = edges.filter { it.to.position == node.position }.sumBy { it.lowerBound }
                val calculatedCapacity = abs(lowerBoundInToNode - generalFilterInfo.minimum)

                edges.add(Edge(node, newSink, calculatedCapacity.toLong(), 0, calculatedCapacity))
            }
            if (node.position == sink.position) {
                val calculatedCapacity = mapStudy.values.sum()
                edges.add(Edge(node, newSink, calculatedCapacity.toLong(), 0, calculatedCapacity))
            }
        }
        return Pair(edges, nodes)
    }

    private fun getCountPerStudy(participantList: ArrayList<Participant>): HashMap<String, Int> {
        val mapStudy = HashMap<String, Int>()

        for (participant in participantList) {
            if (mapStudy.containsKey(participant.group)) {
                mapStudy[participant.group] = mapStudy[participant.group]!! + 1
            } else {
                mapStudy[participant.group] = 1
            }
        }
        return mapStudy
    }
}
