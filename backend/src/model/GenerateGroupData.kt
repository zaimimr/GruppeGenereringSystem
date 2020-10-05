package com.gruppe7.model

data class GenerateGroupData(
    val id: String,
    val participants: Array<Participant>,
    val minimumPerGroup: Int,
    val maximumPerGroup: Int
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as GenerateGroupData

        return id == other.id
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}
