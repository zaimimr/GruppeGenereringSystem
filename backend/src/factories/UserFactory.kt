package com.gruppe7.factories

import com.gruppe7.model.User
import com.gruppe7.utils.types.RegistrationData
import org.springframework.security.crypto.bcrypt.BCrypt
import java.util.UUID

/**
 * Singleton UserFactory to create events for tests
 */
object UserFactory {

    fun registerUserData(name: String = "Test User", email: String = "user@test.com", password: String = "test", repeatPassword: String = "test"): RegistrationData {
        return RegistrationData(
            name,
            email,
            password,
            repeatPassword
        )
    }

    val testUser = User(
        id = UUID.fromString("e9ad2de6-0acc-46f3-9740-f1d7f9b6e640"),
        name = "Test User",
        email = "test@testuser.com",
        password = BCrypt.hashpw("test", BCrypt.gensalt(6)),
        socket_id = null
    )
}
