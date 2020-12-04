package com.gruppe7.utils.exceptions
/**
 * Custom Unauthorized exception
 * Exception is used if user try to access content they don't have access to
 */
class UnauthorizedException(e: String) : Exception(e)
