package com.gruppe7.utils.exceptions

/**
 * Custom duplicationEmail exception
 * Exception is used if user try to register with existing email
 */
class DuplicateEmailException(e: String) : Exception(e)
