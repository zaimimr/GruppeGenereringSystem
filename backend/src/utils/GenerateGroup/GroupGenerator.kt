package com.gruppe7.utils.GenerateGroup

import com.gruppe7.utils.types.FilterInformation
import com.gruppe7.utils.types.Participant
import com.gruppe7.utils.validateGenerateGroupData

class GroupGenerator {
    fun generateGroups(participantList: ArrayList<Participant>, filterInformation: ArrayList<FilterInformation>): Pair<Int, ArrayList<ArrayList<Participant>>> {
        validateGenerateGroupData(filterInformation, participantList)
        return FlowNetwork().solveWithMaximumFlow(participantList, filterInformation)
    }
}
