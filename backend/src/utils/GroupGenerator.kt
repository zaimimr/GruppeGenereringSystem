package com.gruppe7.utils

import com.gruppe7.utils.types.FilterInformation
import com.gruppe7.utils.types.Participant
import java.lang.IllegalArgumentException
import kotlin.math.abs

class GroupGenerator {
    private val FULL_SCORE = 100
    private val HALF_SCORE = 50

    fun groupGeneratorWithDynamicScore(
        participantList: ArrayList<Participant>,
        filterInformation: ArrayList<FilterInformation>
    ): Pair<Boolean, ArrayList<ArrayList<Participant>>> {
        val generalInfo = filterInformation.find { it.name == null } ?: throw IllegalArgumentException("Filter for gruppene generelt er ikke sendt med")

        val listOfGroups: ArrayList<String> = ArrayList()

        var leastMinimumPerGroup = 0
        for (filter in filterInformation) {
            if (filter.name != null) leastMinimumPerGroup += filter.minimum

            if (filter.maximum == 0) filter.maximum = generalInfo.maximum

            if (filter.maximum < 0 || filter.minimum < 0) throw IllegalArgumentException("Negative tall er ikke tillatt")

            if (filter.maximum > 0 && filter.minimum > filter.maximum) throw IllegalArgumentException("Maksimum kan ikke være større enn minimum")

            if (!listOfGroups.contains(filter.name)) filter.name?.let { listOfGroups.add(it) }
        }

        if (leastMinimumPerGroup > generalInfo.minimum) throw IllegalArgumentException("Minimum deltagere per gruppe må være større eller lik summen av alle minimum i hvert filter")

        for (participant in participantList) {
            if (!listOfGroups.contains(participant.group)) throw IllegalArgumentException("${participant.group} har ikke et filter")
        }

        val groups = ArrayList<ArrayList<Participant>>()
        try {
            // TODO
            // Ta hensyn til hvor mange som har riktig størrelse
            // Sjekk modulus umidellbart i intervallet for å ungå unødvendige beregninger
            var bestScore = 0
            var bestGroup: ArrayList<ArrayList<Participant>> = ArrayList()
            while (true) {
                var biggestGroupSizeInIteration = 0
                var iterationScore = 0
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
                            filterCountMap[groupInfo.name]!! >= groupInfo.maximum -> iterationScore += HALF_SCORE - abs(
                                filterCountMap[groupInfo.name]!! - groupInfo.maximum
                            )
                            filterCountMap[groupInfo.name]!! <= groupInfo.minimum -> iterationScore += HALF_SCORE - abs(
                                filterCountMap[groupInfo.name]!! - groupInfo.minimum
                            )
                        }
                    }
                    // TODO
                    // Finne en måte å vektlegge at grupper er over eller under min / Max

                    for (groupInfo in filterInformation) {
                        if (filterCountMap[groupInfo.name] !in (groupInfo.minimum) until groupInfo.maximum + 1) {
                            allCriteriesSucceed = false
                            break
                        }
                    }
                }
                if (allCriteriesSucceed) break
                iterationScore /= groups.size
                iterationScore /= (filterInformation.size)

                if (iterationScore > bestScore) {
                    bestScore = iterationScore
                    // TODO: Save the sizes of each group and generate it if we need to return best effort
                    bestGroup = copyList(groups)
                }
                if (biggestGroupSizeInIteration < generalInfo.minimum) {
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

    private fun copyList(list: ArrayList<ArrayList<Participant>>): ArrayList<ArrayList<Participant>> {
        val newList = ArrayList<ArrayList<Participant>>()
        for (n in 0 until list.size) {
            newList.add(ArrayList())
            for (m in 0 until list[n].size) {
                newList[n].add(Participant(list[n][m].id, list[n][m].name, list[n][m].email, list[n][m].group))
            }
        }
        return newList
    }
}
