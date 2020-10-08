package com.gruppe7.model
import java.util.UUID

data class InvitationData(
    val groupData: Array<Array<String>>,
    val groupName: String,
    val csvHeader: Boolean,
    val csvName: Int,
    val csvEmail: Int
) {
    fun getParticipants(): ArrayList<Participant> {
        val participants = ArrayList<Participant>()
        var startIndex = 0
        if (csvHeader) {
            startIndex = 1
        }
        for (index in startIndex until groupData.size) {
            try {
                val id: String = UUID.randomUUID().toString()
                val name: String = groupData[index][csvName]
                val email: String = groupData[index][csvEmail]
                val group: String = groupName
                participants.add(Participant(id, name, email, group))
            } catch (e: ArrayIndexOutOfBoundsException) {}
        }
        return participants
    }
}
