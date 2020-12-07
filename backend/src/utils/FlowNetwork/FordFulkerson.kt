// Inspiration from: https://github.com/williamfiset/Algorithms/blob/master/src/main/java/com/williamfiset/algorithms/graphtheory/networkflow/examples/FordFulkersonExample.java

package com.gruppe7.utils.FlowNetwork

import com.gruppe7.utils.types.Edge
import utils.types.Node
import java.util.ArrayList

object FordFulkerson {
    abstract class NetworkFlowSolverBase( // Inputs: n = number of nodes, s = source, t = sink
        val n: Int,
        val s: Int,
        val t: Int
    ) {
        // 'visited' and 'visitedToken' are variables used in graph sub-routines to
        // track whether a node has been visited or not. In particular, node 'i' was
        // recently visited if visited[i] == visitedToken is true. This is handy
        // because to mark all nodes as unvisited simply increment the visitedToken.
        protected var visitedToken = 1
        protected var visited: IntArray

        // Indicates whether the network flow algorithm has ran. The solver only
        // needs to run once because it always yields the same result.
        protected var solved = false

        // The maximum flow. Calculated by calling the {@link #solve} method.
        protected var maximumFlow: Long = 0

        // The adjacency list representing the flow graph.
        protected var edgesList: ArrayList<ArrayList<Edge>> = ArrayList<ArrayList<Edge>>()

        // Constructs an empty graph with n nodes including s and t.
        private fun initializeEmptyFlowGraph() {
            edgesList.clear()
            for (i in 0 until n) edgesList.add(ArrayList())
        }

        /**
         * Adds a directed edge (and its residual edge) to the flow graph.
         *
         * @param from - The index of the node the directed edge starts at.
         * @param to - The index of the node the directed edge ends at.
         * @param capacity - The capacity of the edge
         */
        fun addEdge(from: Node, to: Node, capacity: Long, lowerBound: Int) {
            require(capacity >= 0) { "Forward edge capacity <= 0" }
            val e1 = Edge(from, to, capacity, lowerBound, capacity.toInt())
            val e2 = Edge(to, from, 0, 0, 0)
            e1.residual = e2
            e2.residual = e1
            edgesList[from.position].add(e1)
            edgesList[to.position].add(e2)
        }

        /**
         * Returns the residual graph after the solver has been executed. This allows you to inspect the
         * [Edge.flow] and [capacity] values of each edge. This is useful if you are
         * debugging or want to figure out which edges were used during the max flow.
         */
        fun getGraph(): ArrayList<ArrayList<Edge>> {
            execute()
            return edgesList
        }

        // Returns the maximum flow from the source to the sink.
        fun getMaxFlow(): Long {
            execute()
            return maximumFlow
        }

        // Wrapper method that ensures we only call solve() once
        private fun execute() {
            if (solved) return
            solved = true
            solve()
        }

        // Method to implement which solves the network flow problem.
        abstract fun solve()

        companion object {
            // To avoid overflow, set infinity to a value less than Long.MAX_VALUE;
            const val INF = Long.MAX_VALUE / 2
        }

        /**
         * Creates an instance of a flow network solver. Use the [.addEdge] method to add edges to
         * the graph.
         *
         * @param n - The number of nodes in the graph including s and t.
         * @param s - The index of the source node, 0 <= s < n
         * @param t - The index of the sink node, 0 <= t < n and t != s
         */
        init {
            initializeEmptyFlowGraph()
            visited = IntArray(n)
        }
    }

    class FordFulkersonDfsSolver
    /**
     * Creates an instance of a flow network solver. Use the [.addEdge] method to add edges to
     * the graph.
     *
     * @param n - The number of nodes in the graph including s and t.
     * @param s - The index of the source node, 0 <= s < n
     * @param t - The index of the sink node, 0 <= t < n and t != s
     */
    (n: Int, s: Int, t: Int) : NetworkFlowSolverBase(n, s, t) {
        // Performs the Ford-Fulkerson method applying a depth first search as
        // a means of finding an augmenting path.
        override fun solve() {
            // Find max flow by adding all augmenting path flows.
            var f = dfs(s, INF)
            while (f != 0L) {
                visitedToken++
                maximumFlow += f
                f = dfs(s, INF)
            }
        }

        private fun dfs(node: Int, flow: Long): Long {
            // At sink node, return augmented path flow.
            if (node == t) return flow

            // Mark the current node as visited.
            visited[node] = visitedToken
            val edges: List<Edge> = edgesList[node]
            for (edge in edges) {
                if (edge.remainingCapacity() > 0 && visited[edge.to.position] != visitedToken) {
                    val bottleNeck = dfs(edge.to.position, Math.min(flow, edge.remainingCapacity()))

                    // If we made it from s -> t (a.k.a bottleNeck > 0) then
                    // augment flow with bottleneck value.
                    if (bottleNeck > 0) {
                        edge.augment(bottleNeck)
                        return bottleNeck
                    }
                }
            }
            return 0
        }
    }
}
