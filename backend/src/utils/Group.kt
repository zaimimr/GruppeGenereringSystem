package com.gruppe7.utils

data class Group(val groupNumber: Int, val participants: Array<Participant>) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Group

        return groupNumber == other.groupNumber
    }

    override fun hashCode(): Int {
        return groupNumber
    }
}
