package com.gruppe7.model

data class ApprovedGroupsData(
    val event: String,
    val emailCoordinator: String,
    val groups: Array<Array<Participant>>
)
