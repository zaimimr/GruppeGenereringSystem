package com.gruppe7.utils.types

data class CreateEventData(
    val title: String,
    val ingress: String,
    val place: String?,
    val time: String,
    val description: String,
    val minimumPerGroup: Int,
    val maximumPerGroup: Int,
)
