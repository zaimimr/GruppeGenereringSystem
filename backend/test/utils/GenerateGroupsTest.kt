package com.gruppe7.utils

import com.gruppe7.utils.GenerateGroup.BruteForce
import com.gruppe7.utils.GenerateGroup.GroupGenerator
import com.gruppe7.utils.types.FilterInformation
import com.gruppe7.utils.types.Participant
import java.lang.IllegalArgumentException
import java.util.UUID
import kotlin.test.Test
import kotlin.test.assertFailsWith

class GenerateGroupsTest {
    val validSolution = 0

    @Test
    fun `Test returning valid solution with flow network`() {
        val participantList = ArrayList<Participant>()
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User2", "test2@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User3", "test3@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User4", "test4@gmail.com", "Group B"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User5", "test5@gmail.com", "Group B"))
        val filterInformation = ArrayList<FilterInformation>()
        filterInformation.add(FilterInformation(null, 2, 3))
        filterInformation.add(FilterInformation("Group A", 1, 2))
        filterInformation.add(FilterInformation("Group B", 1, 2))
        val resultFromGenerator = GroupGenerator().generateGroups(participantList, filterInformation)
        assert(resultFromGenerator.first == validSolution)
        assert(resultFromGenerator.second.size == 2)
    }

    @Test
    fun `Test returning valid solution with specialized`() {
        val participantList = ArrayList<Participant>()
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User2", "test2@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User3", "test3@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User4", "test4@gmail.com", "Group B"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User5", "test5@gmail.com", "Group B"))
        val filterInformation = ArrayList<FilterInformation>()
        filterInformation.add(FilterInformation(null, 2, 3))
        filterInformation.add(FilterInformation("Group A", 1, 2))
        filterInformation.add(FilterInformation("Group B", 1, 2))
        val resultFromGenerator = BruteForce().solveWithBruteForce(participantList, filterInformation)
        assert(resultFromGenerator.first)
        assert(resultFromGenerator.second.size == 2)
    }

    @Test
    fun `Test returning no valid solution with flow network`() {
        val participantList = ArrayList<Participant>()
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User2", "test2@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User3", "test3@gmail.com", "Group B"))
        val filterInformation = ArrayList<FilterInformation>()
        filterInformation.add(FilterInformation(null, 2, 2))
        filterInformation.add(FilterInformation("Group A", 1, 2))
        filterInformation.add(FilterInformation("Group B", 1, 2))
        val resultFromGenerator = GroupGenerator().generateGroups(participantList, filterInformation)
        assert(resultFromGenerator.first != validSolution)
    }

    @Test
    fun `Test returning no valid solution with specialized`() {
        val participantList = ArrayList<Participant>()
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User2", "test2@gmail.com", "Group A"))
        participantList.add(Participant(UUID.randomUUID().toString(), "Test User3", "test3@gmail.com", "Group B"))
        val filterInformation = ArrayList<FilterInformation>()
        filterInformation.add(FilterInformation(null, 2, 2))
        filterInformation.add(FilterInformation("Group A", 1, 2))
        filterInformation.add(FilterInformation("Group B", 1, 2))
        val resultFromGenerator = BruteForce().solveWithBruteForce(participantList, filterInformation)
        assert(!resultFromGenerator.first)
    }

    @Test
    fun `Test missing general filter`() {
        val exception = assertFailsWith<IllegalArgumentException> {
            val participantList = ArrayList<Participant>()
            participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
            val filterInformation = ArrayList<FilterInformation>()
            filterInformation.add(FilterInformation("Group A", 1, 2))
            GroupGenerator().generateGroups(participantList, filterInformation)
        }
        assert(exception.message == "Filter for gruppene generelt er ikke sendt med")
    }

    @Test
    fun `Test missing filter`() {
        val exception = assertFailsWith<IllegalArgumentException> {
            val participantList = ArrayList<Participant>()
            participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
            participantList.add(Participant(UUID.randomUUID().toString(), "Test User2", "test2@gmail.com", "Group A"))
            participantList.add(Participant(UUID.randomUUID().toString(), "Test User3", "test3@gmail.com", "Group B"))
            val filterInformation = ArrayList<FilterInformation>()
            filterInformation.add(FilterInformation(null, 1, 2))
            filterInformation.add(FilterInformation("Group A", 1, 2))
            GroupGenerator().generateGroups(participantList, filterInformation)
        }
        assert(exception.message == "Group B har ikke et filter")
    }

    @Test
    fun `Test negative numbers in filter`() {
        val exception = assertFailsWith<IllegalArgumentException> {
            val participantList = ArrayList<Participant>()
            participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
            val filterInformation = ArrayList<FilterInformation>()
            filterInformation.add(FilterInformation(null, -1, -4))
            filterInformation.add(FilterInformation("Group A", -4, 8))
            GroupGenerator().generateGroups(participantList, filterInformation)
        }
        assert(exception.message == "Negative tall er ikke tillatt")
    }

    @Test
    fun `Test that specific filters added up is bigger tangential filter`() {
        val exception = assertFailsWith<IllegalArgumentException> {
            val participantList = ArrayList<Participant>()
            participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
            val filterInformation = ArrayList<FilterInformation>()
            filterInformation.add(FilterInformation(null, 3, 5))
            filterInformation.add(FilterInformation("Group A", 5, 8))
            GroupGenerator().generateGroups(participantList, filterInformation)
        }
        assert(exception.message == "Minimum deltagere per gruppe må være større eller lik summen av alle minimum i hvert filter")
    }

    @Test
    fun `Test minimum filter is bigger than maximum`() {
        val exception = assertFailsWith<IllegalArgumentException> {
            val participantList = ArrayList<Participant>()
            participantList.add(Participant(UUID.randomUUID().toString(), "Test User", "test1@gmail.com", "Group A"))
            val filterInformation = ArrayList<FilterInformation>()
            filterInformation.add(FilterInformation(null, 30, 5))
            filterInformation.add(FilterInformation("Group A", 5, 2))
            GroupGenerator().generateGroups(participantList, filterInformation)
        }
        assert(exception.message == "Maksimum kan ikke være større enn minimum")
    }
}
