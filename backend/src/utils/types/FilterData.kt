package com.gruppe7.utils.types

data class FilterData(
    val participants: Array<Participant>,
    val minimumPerGroup: Int,
    val maximumPerGroup: Int,
)
