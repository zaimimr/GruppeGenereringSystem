package com.gruppe7.api

import com.google.gson.Gson
import com.google.gson.JsonParser
import com.gruppe7.addContentJsonHeader
import com.gruppe7.factories.UserFactory
import com.gruppe7.utils.types.LoginCredentials
import com.gruppe7.withServer
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.setBody
import kotlin.test.Test
import kotlin.test.assertFailsWith

class AuthenticationTest {

    @Test
    fun `Test register new user`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = "/register"
            addContentJsonHeader()
            setBody(
                Gson().toJson(UserFactory.registerUserData(email = "user@gmail.com"))
            )
        }
        println(request.response.content)
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.Created)
    }

    @Test
    fun `Test add user with weak password`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = "/register"
            addContentJsonHeader()
            setBody(
                Gson().toJson(
                    UserFactory.registerUserData(
                        email = "user@gmail.com",
                        password = "123",
                        repeatPassword = "123"
                    )
                )
            )
        }
        assert(request.response.status() == HttpStatusCode.BadRequest)
        assert(request.response.content == "Passordet må ha minst 8 karakterer, og inkludere både tall og store og små bokstaver")
        assert(request.requestHandled)
    }

    @Test
    fun `Test register with no-matching password`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = "/register"
            addContentJsonHeader()
            setBody(
                Gson().toJson(
                    UserFactory.registerUserData(
                        email = "newuser@gmail.com",
                        password = "123",
                        repeatPassword = "1234"
                    )
                )
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.BadRequest)
        assert(request.response.content == "Passord må være like")
    }

    @Test
    fun `Test add user with existing email`() = withServer {
        assertFailsWith<org.jetbrains.exposed.exceptions.ExposedSQLException> {
            val request = handleRequest {
                method = HttpMethod.Post
                uri = "/register"
                addContentJsonHeader()
                setBody(
                    Gson().toJson(UserFactory.registerUserData(email = "test@testuser.com"))
                )
            }
            assert(request.requestHandled)
        }
    }

    @Test
    fun `Test login success with token received`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = "/login"
            addContentJsonHeader()
            setBody(
                Gson().toJson(LoginCredentials("test@testuser.com", "test"))
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.OK)
        val token = JsonParser.parseString(request.response.content).asJsonObject["token"]
        assert(!token.isJsonNull)
    }

    @Test
    fun `Test login with no existing user`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = "/login"
            addContentJsonHeader()
            setBody(
                Gson().toJson(LoginCredentials("random@testuser.com", "random"))
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.BadRequest)
    }

    @Test
    fun `Test login with wrong password`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Post
            uri = "/login"
            addContentJsonHeader()
            setBody(
                Gson().toJson(LoginCredentials("test@testuser.com", "test123"))
            )
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.BadRequest)
    }
}
