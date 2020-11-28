package com.gruppe7.utils.GenerateGroup

import com.gruppe7.utils.types.FilterInformation
import com.gruppe7.utils.types.Participant
import com.gruppe7.utils.validateGenerateGroupData

class BruteForce {
    private val FULL_SCORE = 100
    private val HALF_SCORE = 50

    fun solveWithBruteForce(
        participantList: ArrayList<Participant>,
        filterInformation: ArrayList<FilterInformation>
    ): Pair<Boolean, ArrayList<ArrayList<Participant>>> {
        validateGenerateGroupData(filterInformation, participantList)
        val groups = ArrayList<ArrayList<Participant>>()
        try {
            // TODO
            // Ta hensyn til hvor mange som har riktig størrelse
            // Sjekk modulus umidellbart i intervallet for å ungå unødvendige beregninger
            var bestScore = 0.0
            var bestGroup: ArrayList<ArrayList<Participant>> = ArrayList()

            while (true) {
                var biggestGroupSizeInIteration = 0
                var iterationScore: Double = 0.0
                groups.add(ArrayList())
                var index = 0
                for (participant in participantList) {
                    groups[index].add(participant)
                    index = if (index == groups.size - 1) 0 else index + 1
                }

                // Todo: Se om det er mulig å beregne scoren på en bedre måte
                var allCriteriesSucceed = true
                for (group in groups) {
                    if (group.size > biggestGroupSizeInIteration) biggestGroupSizeInIteration = group.size

                    val filterCountMap = mutableMapOf<String?, Int>()
                    for (groupName in filterInformation) {
                        if (groupName.name == null) {
                            filterCountMap[null] = group.size
                        } else {
                            filterCountMap[groupName.name] = 0
                        }
                    }

                    // Counting the different classes
                    for (participant in group) {
                        filterCountMap.putIfAbsent(participant.group, 0)
                        filterCountMap[participant.group] = filterCountMap[participant.group]!! + 1
                    }
                    for (groupInfo in filterInformation) {
                        when {
                            filterCountMap[groupInfo.name]!! in groupInfo.minimum..groupInfo.maximum -> iterationScore += FULL_SCORE
                            filterCountMap[groupInfo.name]!! >= groupInfo.maximum -> iterationScore += HALF_SCORE * groupInfo.maximum / filterCountMap[groupInfo.name]!!
                            filterCountMap[groupInfo.name]!! <= groupInfo.minimum -> iterationScore += HALF_SCORE * filterCountMap[groupInfo.name]!! / groupInfo.minimum
                        }
                        if (filterCountMap[groupInfo.name] !in (groupInfo.minimum) until groupInfo.maximum + 1) {
                            allCriteriesSucceed = false
                        }
                    }
                }
                if (allCriteriesSucceed) break
                iterationScore /= groups.size
                iterationScore /= filterInformation.size
                if (iterationScore > bestScore) {
                    bestScore = iterationScore
                    // TODO: Save the sizes of each group and generate it if we need to return best effort
                    bestGroup = copyList(groups)
                }
                if (biggestGroupSizeInIteration < filterInformation.find { it.name == null }!!.minimum || groups.size > participantList.size) {
                    return Pair(false, bestGroup)
                }

                for (group in groups) {
                    group.clear()
                }
            }
            return Pair(true, groups)
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Noe gikk galt med generering av grupper")
        }
    }

    private fun copyList(lists: ArrayList<ArrayList<Participant>>): ArrayList<ArrayList<Participant>> {
        val newList = ArrayList<ArrayList<Participant>>()
        for (list in lists) {
            val partipantList = ArrayList<Participant>()
            for (partipant in list) {
                partipantList.add(partipant)
            }
            newList.add(partipantList)
        }
        return newList
    }
}
