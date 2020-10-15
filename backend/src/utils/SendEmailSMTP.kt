package com.gruppe7.utils

import com.gruppe7.utils.types.Participant
import com.gruppe7.utils.types.PresentData
import io.github.cdimascio.dotenv.dotenv
import java.lang.System.getProperties
import java.net.UnknownHostException
import javax.mail.MessagingException
import javax.mail.Session
import javax.mail.Transport
import javax.mail.internet.AddressException
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeMessage

class SendEmailSMTP {
    val dotenv = dotenv {
        ignoreIfMalformed = true
        ignoreIfMissing = true
    }
    val EMAIL_HOST = if (System.getenv("EMAIL_HOST") != null) System.getenv("EMAIL_HOST") else dotenv["EMAIL_HOST"]
    val EMAIL_PORT = if (System.getenv("EMAIL_PORT") != null) System.getenv("EMAIL_PORT") else dotenv["EMAIL_PORT"]
    val EMAIL_USERNAME = if (System.getenv("EMAIL_USERNAME") != null) System.getenv("EMAIL_USERNAME") else dotenv["EMAIL_USERNAME"]
    val EMAIL_PASSWORD = if (System.getenv("EMAIL_PASSWORD") != null) System.getenv("EMAIL_PASSWORD") else dotenv["EMAIL_PASSWORD"]
    val FRONTEND_URL = if (System.getenv("FRONTEND_URL") != null) System.getenv("FRONTEND_URL") else dotenv["FRONTEND_URL"]

    private fun initEmail(): Pair<Session, Transport> {
        try {

            val properties = getProperties()
            properties["mail.smtp.host"] = EMAIL_HOST
            properties["mail.smtp.port"] = EMAIL_PORT
            properties["mail.smtp.ssl.enable"] = "true"
            properties["mail.smtp.auth"] = "true"
            properties["mail.smtp.user"] = EMAIL_USERNAME
            properties["mail.smtp.password"] = EMAIL_PASSWORD

            val session = Session.getDefaultInstance(properties)
            val transport = session.getTransport("smtp")

            transport.connect(EMAIL_HOST, EMAIL_USERNAME, EMAIL_PASSWORD)
            return Pair(session, transport)
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Noe gikk galt ved oppkobling av e-post")
        }
    }

    fun sendInvitation(participants: Array<Participant>, event: String) {
        val (session, transport) = initEmail()
        try {
            for (participant in participants) {
                val mailToBeSent = MimeMessage(session)
                mailToBeSent.setFrom(InternetAddress(EMAIL_USERNAME))
                mailToBeSent.addRecipient(MimeMessage.RecipientType.TO, InternetAddress(participant.email))
                mailToBeSent.subject = "Påmelding til $event"
                val body = "<h1>Påmelding til $event </h1> \n <p>Her er linken for å melde deg på er: $FRONTEND_URL/$event/join/${participant.id}/ </p>"
                mailToBeSent.setContent(body, "text/html;charset=utf-8")
                transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
            }
        } catch (ae: AddressException) {
            ae.printStackTrace()
            throw AddressException("Ugyldig epost")
        } catch (me: MessagingException) {
            me.printStackTrace()
            throw MessagingException("Noe gikk galt med sending av e-post")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Noe gikk galt")
        } finally {
            transport.close()
        }
    }

    fun sendGroup(finalData: PresentData, event: String, coordinatorEmail: String) {
        val (session, transport) = initEmail()
        try {
            var allGroups = ""
            val validGroups = finalData.generatedGroups.filter { group: Array<Participant> -> group.isNotEmpty() }
            for ((index, group) in validGroups.withIndex()) {
                val groupNumber = (index + 1)
                var groupMembers = "<ul>"
                var emails = ""
                allGroups += "Gruppenummer  $groupNumber\n"
                for (participant in group) {
                    groupMembers += "<li>${ participant.name } </li>"
                    emails += participant.email + ","
                }
                groupMembers += "</ul>"
                allGroups += groupMembers + "\n"
                val mailToBeSent = MimeMessage(session)
                mailToBeSent.setFrom(InternetAddress(EMAIL_USERNAME))
                mailToBeSent.setRecipients(MimeMessage.RecipientType.TO, InternetAddress.parseHeader(emails, false))
                mailToBeSent.subject = "Din gruppe i $event"
                val body = "<h1>Velkommen til $event </h1> \n <p>Du er på gruppe nummer $groupNumber. Gruppen består av følgende personer: \n $groupMembers </p>"
                mailToBeSent.setContent(body, "text/html;charset=utf-8")
                transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
            }
            val mailToBeSent = MimeMessage(session)
            mailToBeSent.setFrom(InternetAddress(EMAIL_USERNAME))
            mailToBeSent.setRecipient(MimeMessage.RecipientType.TO, InternetAddress(coordinatorEmail))
            mailToBeSent.subject = "Grupper i $event"
            val criteriaMessage = if (finalData.isCriteria) "oppfylt" else "ikke oppfylt"
            val body = "<h1>Her er gruppene i $event \n </h1><p>  Kriteriene ble $criteriaMessage \n </p> $allGroups"
            mailToBeSent.setContent(body, "text/html;charset=utf-8")
            transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
        } catch (ae: AddressException) {
            ae.printStackTrace()
            throw AddressException("Noe gikk galt; ugyldig e-post")
        } catch (me: MessagingException) {
            me.printStackTrace()
            throw MessagingException("Noe gikk galt; ugyldig e-post tekst")
        } catch (me: UnknownHostException) {
            me.printStackTrace()
            throw UnknownHostException("Noe gikk galt under sending av e-post")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Noe gikk galt")
        } finally {
            transport.close()
        }
    }

    fun sendNewPassword(email: String, linkToResetPassword: String) {
        val (session, transport) = initEmail()
        try {
            val mailToBeSent = MimeMessage(session)
            mailToBeSent.setFrom(InternetAddress(EMAIL_USERNAME))
            mailToBeSent.addRecipient(MimeMessage.RecipientType.TO, InternetAddress(email))
            mailToBeSent.subject = "Tilbakestill passord"
            val body = "<p>Her er linken du kan benytte deg for å oppdatere ditt passord: $linkToResetPassword</p>"
            mailToBeSent.setContent(body, "text/html;charset=utf-8")
            transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
        } catch (ae: AddressException) {
            ae.printStackTrace()
            throw AddressException("Noe gikk galt; ugyldig e-post")
        } catch (me: MessagingException) {
            me.printStackTrace()
            throw MessagingException("Noe gikk galt med sending av e-post")
        } catch (e: Exception) {
            e.printStackTrace()
            throw Exception("Noe gikk galt")
        } finally {
            transport.close()
        }
    }
}
