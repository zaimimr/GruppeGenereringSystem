package com.gruppe7.model

import com.gruppe7.utils.Group

data class ApprovedGroupsData(
    val event: String,
    val emailCoordinator: String,
    val groups: Array<Group>
)
