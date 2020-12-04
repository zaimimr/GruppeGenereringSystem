package com.gruppe7.api

import com.google.gson.Gson
import com.gruppe7.addContentJsonHeader
import com.gruppe7.addJwtHeader
import com.gruppe7.factories.UserFactory
import com.gruppe7.model.User
import com.gruppe7.withServer
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import kotlin.test.Test

class UserTest {
    val baseURL = "/user"

    @Test
    fun `Test get user`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Get
            uri = baseURL
            addContentJsonHeader()
            addJwtHeader()
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.OK)
        val user = Gson().fromJson(request.response.content, User::class.java)
        assert(user.id == UserFactory.testUser.id)
    }

    @Test
    fun `Test get user without token`() = withServer {
        val request = handleRequest {
            method = HttpMethod.Get
            uri = baseURL
            addContentJsonHeader()
        }
        assert(request.requestHandled)
        assert(request.response.status() == HttpStatusCode.Unauthorized)
        assert(request.response.content.isNullOrEmpty())
    }
}
