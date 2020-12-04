package com.gruppe7.utils.types

import utils.types.Node

class Edge(var from: Node, var to: Node, val capacity: Long, val lowerBound: Int, val upperBound: Int) {
    var residual: Edge? = null
    var flow: Long = 0
    fun isResidual(): Boolean {
        return capacity == 0L
    }

    fun remainingCapacity(): Long {
        return capacity - flow
    }

    fun augment(bottleNeck: Long) {
        flow += bottleNeck
        residual!!.flow -= bottleNeck
    }

    override fun toString(): String {
        return "From: $from , To: $to, Capacity: $capacity"
    }

    fun toString(source: Int, sink: Int): String {
        val fromNode = if (from.position == source) "s" else if (from.position == sink) "t" else from.toString()
        val toNode = if (to.position == source) "s" else if (to.position == sink) "t" else to.toString()
        return String.format(
            "Edge %s -> %s | flow = %3d | capacity = %3d | is residual: %s",
            fromNode,
            toNode,
            flow,
            capacity,
            isResidual()
        )
    }
}
