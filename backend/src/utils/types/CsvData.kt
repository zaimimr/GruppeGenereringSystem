package com.gruppe7.utils.types
import java.util.UUID

data class CsvData(
    val csvData: Array<Array<String>>,
    val groupName: String,
    val csvIsHeader: Boolean,
    val csvNameField: Int,
    val csvEmailField: Int
) {
    fun getParticipants(): ArrayList<Participant> {
        val participants = ArrayList<Participant>()
        var startIndex = 0
        if (csvIsHeader) {
            startIndex = 1
        }
        for (index in startIndex until csvData.size) {
            try {
                val id: String = UUID.randomUUID().toString()
                val name: String = csvData[index][csvNameField]
                val email: String = csvData[index][csvEmailField]
                val group: String = groupName
                participants.add(Participant(id, name, email, group))
            } catch (e: ArrayIndexOutOfBoundsException) {}
        }
        return participants
    }
}
