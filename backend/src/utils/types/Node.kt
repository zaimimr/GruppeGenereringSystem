package utils.types

interface Node {
    val position: Int
    var capacity: Int
    val name: String
}

data class StudyProgramNode(override val position: Int, override var capacity: Int = 0, override val name: String) :
    Node

data class GroupNode(override val position: Int, override var capacity: Int = 0, override val name: String) : Node

data class RegularNode(override var position: Int, override var capacity: Int = 0, override val name: String) : Node
