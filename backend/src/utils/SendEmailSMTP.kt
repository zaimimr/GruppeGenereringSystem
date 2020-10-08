package com.gruppe7.utils

import com.gruppe7.model.Participant
import io.github.cdimascio.dotenv.Dotenv
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

    private fun initEmail(): Triple<Dotenv, Session, Transport> {
        val dotenv = dotenv()
        val properties = getProperties()
        properties["mail.smtp.host"] = dotenv["EMAIL_HOST"]
        properties["mail.smtp.port"] = dotenv["EMAIL_PORT"]
        properties["mail.smtp.ssl.enable"] = "true"
        properties["mail.smtp.auth"] = "true"
        properties["mail.smtp.user"] = dotenv["EMAIL_USERNAME"]
        properties["mail.smtp.password"] = dotenv["EMAIL_PASSWORD"]

        val session = Session.getDefaultInstance(properties)
        val transport = session.getTransport("smtp")

        transport.connect(dotenv["EMAIL_HOST"], dotenv["EMAIL_USERNAME"], dotenv["EMAIL_PASSWORD"])
        return Triple(dotenv, session, transport)
    }

    fun sendInvitation(participants: Array<Participant>, event: String): Boolean {
        val (dotenv, session, transport) = initEmail()
        try {
            for (participant in participants) {
                val mailToBeSent = MimeMessage(session)
                mailToBeSent.setFrom(InternetAddress(dotenv["EMAIL_USERNAME"]))
                mailToBeSent.addRecipient(MimeMessage.RecipientType.TO, InternetAddress(participant.email))
                mailToBeSent.subject = "Påmelding til $event"
                val body = "<h1>Påmelding til $event </h1> \n <p>Her er linken for å melde deg på er: ${dotenv["FRONTEND_URL"]}/$event/join/${participant.id}/ </p>"
                mailToBeSent.setContent(body, "text/html;charset=utf-8")
                transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
            }
            transport.close()
            return true
        } catch (ae: AddressException) {
            ae.printStackTrace()
            return false
        } catch (me: MessagingException) {
            me.printStackTrace()
            return false
        }
    }

    fun sendGroup(groups: Array<Array<Participant>>, event: String, emailCoordinator: String): Boolean {
        val (dotenv, session, transport) = initEmail()
        try {
            var allGroups = ""
            for ((index, group) in groups.withIndex()) {
                val groupNumber = (index + 1)
                var groupMembers = "<ul>"
                var emails = ""
                allGroups += "Gruppenummer " + groupNumber + "\n"
                for (participant in group) {
                    groupMembers += "<li>${ participant.name } </li>"
                    emails += participant.email + ","
                }
                groupMembers += "</ul>"
                allGroups += groupMembers + "\n"
                val mailToBeSent = MimeMessage(session)
                mailToBeSent.setFrom(InternetAddress(dotenv["EMAIL_USERNAME"]))
                mailToBeSent.setRecipients(MimeMessage.RecipientType.TO, InternetAddress.parseHeader(emails, false))
                mailToBeSent.subject = "Din gruppe i $event"
                val body = "<h1>Velkommen til $event </h1> \n <p>Du er på gruppe number $groupNumber. Gruppen består av følgende personer: \n $groupMembers </p>"
                mailToBeSent.setContent(body, "text/html;charset=utf-8")
                transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
            }
            val mailToBeSent = MimeMessage(session)
            mailToBeSent.setFrom(InternetAddress(dotenv["EMAIL_USERNAME"]))
            mailToBeSent.setRecipient(MimeMessage.RecipientType.TO, InternetAddress(emailCoordinator))
            mailToBeSent.subject = "Grupper i $event"
            val body = "<h1>Her er gruppene i $event </h1> \n $allGroups"
            mailToBeSent.setContent(body, "text/html;charset=utf-8")
            transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
            transport.close()
            return true
        } catch (ae: AddressException) {
            ae.printStackTrace()
            return false
        } catch (me: MessagingException) {
            me.printStackTrace()
            return false
        } catch (me: UnknownHostException) {
            me.printStackTrace()
            return false
        }
    }

    fun sendNewPassword(email: String, event: String, linkToResetPassword: String): Boolean {
        val (dotenv, session, transport) = initEmail()
        try {
            val mailToBeSent = MimeMessage(session)
            mailToBeSent.setFrom(InternetAddress(dotenv["EMAIL_USERNAME"]))
            mailToBeSent.addRecipient(MimeMessage.RecipientType.TO, InternetAddress(email))
            mailToBeSent.subject = "Tilbakestill passord"
            val body = "<p>Her er linken du kan benytte deg for å oppdatere ditt passord: $linkToResetPassword</p>"
            mailToBeSent.setContent(body, "text/html;charset=utf-8")
            transport.sendMessage(mailToBeSent, mailToBeSent.allRecipients)
            transport.close()
            return true
        } catch (ae: AddressException) {
            ae.printStackTrace()
            return false
        } catch (me: MessagingException) {
            me.printStackTrace()
            return false
        }
    }
}
