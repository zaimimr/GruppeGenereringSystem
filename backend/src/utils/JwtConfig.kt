package com.gruppe7.utils

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.gruppe7.model.User
import com.gruppe7.service.UserService
import io.ktor.auth.Principal
import io.ktor.auth.jwt.JWTCredential
import java.util.Date
import java.util.UUID

object JwtConfig {

    private val secret = getSystemVariable("JWT_SECRET") ?: "randomstring"
    private const val issuer = "gen-g"
    private const val validityInMs = 36_000_00 * 10 // 10 hours
    private val algorithm = Algorithm.HMAC512(secret)

    fun generateToken(user: User): String = JWT.create()
        .withSubject("Authentication")
        .withIssuer(issuer)
        .withClaim("id", user.id.toString())
        .withExpiresAt(obtainExpirationDate())
        .sign(algorithm)

    private fun obtainExpirationDate() = Date(System.currentTimeMillis() + validityInMs)

    fun buildJwtVerifier(): JWTVerifier = JWT.require(algorithm).withIssuer(issuer).build()

    suspend fun validateCredential(jwtCredential: JWTCredential): Principal? =
        run {
            val id = jwtCredential.payload.getClaim("id").asString()
            if (id != null) {
                return UserService().getUser(UUID.fromString(id))
            }
            return null
        }
}
