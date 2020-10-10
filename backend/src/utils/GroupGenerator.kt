package com.gruppe7.utils

import com.gruppe7.utils.types.Participant
import kotlin.math.abs

class GroupGenerator {
    private val FULL_SCORE = 100
    private val HALF_SCORE = 50

    fun groupGeneratorWithDynamicScore(participantList: ArrayList<Participant>, minParticipantsPerGroup: Int, maxParticipantsPerGroup: Int): Pair<Boolean, ArrayList<ArrayList<Participant>>> {
        try {
            val groups = ArrayList<ArrayList<Participant>>()

            // TODO
            // Ta hensyn til hvor mange som har riktig størrelse
            // Sjekk modulus umidellbart i intervallet for å ungå unødvendige beregninger
            var bestScore = 0
            var bestGroup: List<ArrayList<Participant>> = ArrayList()
            while (true) {
                var biggestGroupSizeInIteration = 0
                var iterationScore = 0
                groups.add(ArrayList())
                var index = 0
                for (participant in participantList) {
                    groups[index].add(participant)
                    index = if (index == groups.size - 1) 0 else index + 1
                }

                // ToDo
                // Se om det er mulig å beregne scoren på en bedre måte
                var allGroupsInInterval = true
                for (group in groups) {
                    if (group.size > biggestGroupSizeInIteration) biggestGroupSizeInIteration = group.size

                    if (group.size in minParticipantsPerGroup..maxParticipantsPerGroup) iterationScore += FULL_SCORE
                    else if (group.size >= maxParticipantsPerGroup) iterationScore += HALF_SCORE - abs(group.size - maxParticipantsPerGroup)
                    else if (group.size <= minParticipantsPerGroup) iterationScore += HALF_SCORE - abs(group.size - minParticipantsPerGroup)

                    // TODO
                    // Finne en måte å vektlegge at grupper er over eller under min / Max
                    if (group.size !in (minParticipantsPerGroup) until maxParticipantsPerGroup + 1) {
                        allGroupsInInterval = false
                    }
                }
                if (allGroupsInInterval) break

                iterationScore /= groups.size
                if (iterationScore > bestScore) {
                    bestScore = iterationScore
                    // TODO
                    // Save the sizes of each group and generate it if we need to return best effort
                    bestGroup = copyList(groups)
                }

                if (biggestGroupSizeInIteration < minParticipantsPerGroup) {
                    bestGroup as ArrayList<ArrayList<Participant>>
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
