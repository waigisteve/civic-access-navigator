from __future__ import annotations

from datetime import datetime
from typing import Any

from backend.app.services.workflow_db_service import (
    create_sos_request,
    create_ussd_session_record,
    create_workflow_report,
    get_workflow_incident,
    get_workflow_report,
    workflow_database_ready,
)


LANGUAGE_MAP = {
    "1": "en",
    "2": "sw",
}

SCENARIO_MAP = {
    "1": "resident",
    "2": "idp",
    "3": "refugee",
}

INCIDENT_MAP = {
    "resident": {
        "1": "checkpoint",
        "2": "denied_aid",
        "3": "report_abuse",
    },
    "idp": {
        "1": "movement_risk",
        "2": "lost_documents",
    },
    "refugee": {
        "1": "border_delay",
    },
}

CONTACT_MAP = {
    "1": "sms",
    "2": "anonymous",
    "3": "callback",
}

COPY = {
    "en": {
        "welcome": "CON Civic Access Nav\n1.English\n2.Kiswahili",
        "main": "CON 1.Start report\n2.Follow up\n3.Rights help\n4.Emergency",
        "invalid": "END Invalid option. Dial again.",
        "scenario": "CON Choose context\n1.Home area\n2.Displaced\n3.Refugee",
        "resident_incidents": "CON Incident\n1.Checkpoint\n2.Denied aid\n3.Report abuse",
        "idp_incidents": "CON Incident\n1.Movement risk\n2.Lost documents",
        "refugee_incidents": "CON Incident\n1.Border delay",
        "ask_location": "CON Enter location or landmark",
        "ask_denied": "CON What was denied or what harm happened?",
        "ask_action": "CON What help or action do you expect next?",
        "ask_contact": "CON Follow-up mode\n1.SMS\n2.Anonymous\n3.Call back",
        "saved": "END Report saved. Ref #{id}. Keep this ID for follow up.",
        "saved_local": "END Report captured, but DB is offline. Try again later.",
        "followup_prompt": "CON Enter report ID",
        "followup_missing": "END Report not found.",
        "followup_status": "END Ref #{id}: {status}. Incident: {incident}. Contact: {contact}.",
        "rights_menu": "CON Rights help\n1.Checkpoint\n2.Denied aid\n3.Report abuse",
        "rights_checkpoint": "END At a checkpoint, record time/place, avoid escalation, and preserve a rights-based note for later action.",
        "rights_denied_aid": "END If aid is denied, note who refused, what was denied, and what immediate remedy is needed.",
        "rights_abuse": "END If abuse occurs, reduce identifying details, preserve a low-risk record, and report through the safest channel.",
        "emergency_menu": "CON Emergency\n1.Immediate danger\n2.Medical help\n3.SMS help later",
        "emergency_now": "END Immediate danger: call 112 now or contact a trusted local responder.",
        "emergency_medical": "END For urgent medical help, go to the nearest hospital or call 112 if that is safer.",
        "emergency_sms": "END Send an SMS help request if voice is unsafe. Keep your report ID if one was created.",
    },
    "sw": {
        "welcome": "CON Civic Access Nav\n1.English\n2.Kiswahili",
        "main": "CON 1.Anza ripoti\n2.Fuatilia\n3.Msaada wa haki\n4.Dharura",
        "invalid": "END Chaguo si sahihi. Jaribu tena.",
        "scenario": "CON Chagua hali\n1.Nyumbani\n2.Umehama ndani\n3.Mkimbizi",
        "resident_incidents": "CON Tukio\n1.Kizuizi\n2.Kunyimwa msaada\n3.Ripoti unyanyasaji",
        "idp_incidents": "CON Tukio\n1.Hatari ya safari\n2.Nyaraka zimepotea",
        "refugee_incidents": "CON Tukio\n1.Kucheleweshwa mpakani",
        "ask_location": "CON Weka eneo au alama ya karibu",
        "ask_denied": "CON Nini kilinyimwa au madhara gani yalitokea?",
        "ask_action": "CON Unatarajia msaada au hatua gani inayofuata?",
        "ask_contact": "CON Njia ya ufuatiliaji\n1.SMS\n2.Bila jina\n3.Pigiwa simu",
        "saved": "END Ripoti imehifadhiwa. Rejea #{id}. Hifadhi namba hii kwa ufuatiliaji.",
        "saved_local": "END Ripoti imenakiliwa, lakini DB haipatikani. Jaribu tena baadaye.",
        "followup_prompt": "CON Weka namba ya rejea ya ripoti",
        "followup_missing": "END Ripoti haijapatikana.",
        "followup_status": "END Rejea #{id}: {status}. Tukio: {incident}. Mawasiliano: {contact}.",
        "rights_menu": "CON Msaada wa haki\n1.Kizuizi\n2.Kunyimwa msaada\n3.Unyanyasaji",
        "rights_checkpoint": "END Ukiwa kwenye kizuizi, andika muda na mahali, epuka mvutano, na hifadhi dokezo la haki kwa hatua ya baadaye.",
        "rights_denied_aid": "END Ukikosa msaada, andika nani alikataa, nini kilinyimwa, na msaada wa haraka unaohitajika.",
        "rights_abuse": "END Ukipata unyanyasaji, punguza taarifa za utambulisho, hifadhi rekodi salama, na ripoti kupitia njia salama zaidi.",
        "emergency_menu": "CON Dharura\n1.Hatari ya sasa\n2.Msaada wa matibabu\n3.SMS baadaye",
        "emergency_now": "END Hatari ya sasa: piga 112 sasa au wasiliana na mwitikio wa karibu unayemuamini.",
        "emergency_medical": "END Kwa matibabu ya haraka, nenda hospitali ya karibu au piga 112 ikiwa hiyo ni salama zaidi.",
        "emergency_sms": "END Tuma ombi la msaada kwa SMS ikiwa kupiga simu si salama. Hifadhi rejea ya ripoti ikiwa ipo.",
    },
}


def _split_text(value: str) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in value.split("*")]


def _response(body: str, *, terminal: bool, stage: str, language: str, report_id: int | None = None) -> dict[str, Any]:
    return {
        "body": body,
        "terminal": terminal,
        "stage": stage,
        "language": language,
        "workflow_report_id": report_id,
    }


def _record_callback(
    *,
    session_id: str,
    phone_number: str,
    service_code: str,
    text: str,
    result: dict[str, Any],
) -> None:
    if not workflow_database_ready():
        return
    try:
        create_ussd_session_record(
            {
                "session_id": session_id,
                "phone_number": phone_number,
                "service_code": service_code,
                "provider": "africastalking",
                "language": result.get("language"),
                "user_path": text,
                "stage": result.get("stage"),
                "menu_text": result.get("body"),
                "terminal": result.get("terminal"),
                "workflow_report_id": result.get("workflow_report_id"),
            }
        )
    except Exception:
        pass


def _scenario_code(choice: str) -> str | None:
    return SCENARIO_MAP.get(choice)


def _incident_code(scenario_code: str, choice: str) -> str | None:
    return INCIDENT_MAP.get(scenario_code, {}).get(choice)


def _contact_preference(choice: str) -> str:
    return CONTACT_MAP.get(choice, "anonymous")


def _status_text(language: str, value: str) -> str:
    if language == "sw":
        return {
            "submitted": "imewasilishwa",
            "queued": "imesubiri kutumwa",
        }.get(value, value)
    return value


def _contact_text(language: str, value: str) -> str:
    if language == "sw":
        return {
            "sms": "sms",
            "anonymous": "bila jina",
            "callback": "pigiwa simu",
        }.get(value, value)
    return value


def _save_workflow_report(
    *,
    language: str,
    scenario_code: str,
    incident_code: str,
    location_text: str,
    denied_item: str,
    requested_action: str,
    contact_preference: str,
) -> int | None:
    if not workflow_database_ready():
        return None
    detail = get_workflow_incident(scenario_code, incident_code)
    if not detail:
        return None
    incident = detail["incident"]
    action = (incident.get("action_points") or [{}])[0]
    summary_lines = [
        f"Location: {location_text}" if location_text else "",
        f"Denied/Harm: {denied_item}" if denied_item else "",
        f"Expected action: {requested_action}" if requested_action else "",
    ]
    item = create_workflow_report(
        {
            "scenario_code": scenario_code,
            "scenario_title_display": detail["scenario"].get("title"),
            "incident_code": incident_code,
            "incident_title_display": incident.get("title"),
            "action_code": action.get("code", "ussd_report"),
            "action_title": action.get("title", "USSD report"),
            "action_title_display": action.get("title", "USSD report"),
            "report_text": "\n".join(line for line in summary_lines if line),
            "location_text": location_text or None,
            "event_time": datetime.utcnow().isoformat(timespec="minutes"),
            "denied_item": denied_item or None,
            "requested_action": requested_action or None,
            "contact_preference": contact_preference,
            "submitter_alias": None,
            "region": incident.get("region", "kenya"),
            "language": language,
            "safe_mode": True,
            "lite_mode": True,
            "status": "queued" if action.get("channel") == "queue" else "submitted",
        }
    )
    return int(item["id"])


def handle_africastalking_ussd(payload: dict[str, str]) -> dict[str, Any]:
    session_id = (payload.get("sessionId") or "").strip()
    service_code = (payload.get("serviceCode") or "").strip()
    phone_number = (payload.get("phoneNumber") or "").strip()
    text = (payload.get("text") or "").strip()
    segments = _split_text(text)

    if not segments or not segments[0]:
        result = _response(COPY["en"]["welcome"], terminal=False, stage="language", language="en")
        _record_callback(session_id=session_id, phone_number=phone_number, service_code=service_code, text=text, result=result)
        return result

    language = LANGUAGE_MAP.get(segments[0])
    if not language:
        result = _response("END Invalid language option.", terminal=True, stage="invalid_language", language="en")
        _record_callback(session_id=session_id, phone_number=phone_number, service_code=service_code, text=text, result=result)
        return result

    copy = COPY[language]
    if len(segments) == 1:
        result = _response(copy["main"], terminal=False, stage="main_menu", language=language)
        _record_callback(session_id=session_id, phone_number=phone_number, service_code=service_code, text=text, result=result)
        return result

    branch = segments[1]
    if branch == "1":
        result = _handle_start_report(copy, language, segments)
    elif branch == "2":
        result = _handle_follow_up(copy, language, segments)
    elif branch == "3":
        result = _handle_rights_help(copy, language, segments)
    elif branch == "4":
        result = _handle_emergency(copy, language, segments, phone_number=phone_number)
    else:
        result = _response(copy["invalid"], terminal=True, stage="invalid_main", language=language)

    _record_callback(session_id=session_id, phone_number=phone_number, service_code=service_code, text=text, result=result)
    return result


def _handle_start_report(copy: dict[str, str], language: str, segments: list[str]) -> dict[str, Any]:
    if len(segments) == 2:
        return _response(copy["scenario"], terminal=False, stage="scenario", language=language)
    scenario_code = _scenario_code(segments[2])
    if not scenario_code:
        return _response(copy["invalid"], terminal=True, stage="invalid_scenario", language=language)
    if len(segments) == 3:
        menu_key = f"{scenario_code}_incidents"
        return _response(copy[menu_key], terminal=False, stage="incident", language=language)
    incident_code = _incident_code(scenario_code, segments[3])
    if not incident_code:
        return _response(copy["invalid"], terminal=True, stage="invalid_incident", language=language)
    if len(segments) == 4:
        return _response(copy["ask_location"], terminal=False, stage="ask_location", language=language)
    if len(segments) == 5:
        return _response(copy["ask_denied"], terminal=False, stage="ask_denied", language=language)
    if len(segments) == 6:
        return _response(copy["ask_action"], terminal=False, stage="ask_action", language=language)
    if len(segments) == 7:
        return _response(copy["ask_contact"], terminal=False, stage="ask_contact", language=language)

    location_text = segments[4]
    denied_item = segments[5]
    requested_action = segments[6]
    contact_preference = _contact_preference(segments[7])
    report_id = _save_workflow_report(
        language=language,
        scenario_code=scenario_code,
        incident_code=incident_code,
        location_text=location_text,
        denied_item=denied_item,
        requested_action=requested_action,
        contact_preference=contact_preference,
    )
    if not report_id:
        return _response(copy["saved_local"], terminal=True, stage="saved_local", language=language)
    return _response(copy["saved"].replace("{id}", str(report_id)), terminal=True, stage="saved", language=language, report_id=report_id)


def _handle_follow_up(copy: dict[str, str], language: str, segments: list[str]) -> dict[str, Any]:
    if len(segments) == 2:
        return _response(copy["followup_prompt"], terminal=False, stage="follow_up_prompt", language=language)
    try:
        report_id = int(segments[2])
    except (TypeError, ValueError):
        return _response(copy["followup_missing"], terminal=True, stage="follow_up_missing", language=language)
    report = get_workflow_report(report_id)
    if not report:
        return _response(copy["followup_missing"], terminal=True, stage="follow_up_missing", language=language)
    incident = report.get("incident_title_display") or report.get("incident_code") or "-"
    contact = _contact_text(language, str(report.get("contact_preference") or "-"))
    status = _status_text(language, str(report.get("status") or "-"))
    body = copy["followup_status"].replace("{id}", str(report_id)).replace("{status}", status).replace("{incident}", incident).replace("{contact}", contact)
    return _response(body, terminal=True, stage="follow_up_status", language=language, report_id=report_id)


def _handle_rights_help(copy: dict[str, str], language: str, segments: list[str]) -> dict[str, Any]:
    if len(segments) == 2:
        return _response(copy["rights_menu"], terminal=False, stage="rights_menu", language=language)
    topic = segments[2]
    if topic == "1":
        return _response(copy["rights_checkpoint"], terminal=True, stage="rights_checkpoint", language=language)
    if topic == "2":
        return _response(copy["rights_denied_aid"], terminal=True, stage="rights_denied_aid", language=language)
    if topic == "3":
        return _response(copy["rights_abuse"], terminal=True, stage="rights_abuse", language=language)
    return _response(copy["invalid"], terminal=True, stage="invalid_rights", language=language)


def _handle_emergency(copy: dict[str, str], language: str, segments: list[str], *, phone_number: str) -> dict[str, Any]:
    if len(segments) == 2:
        return _response(copy["emergency_menu"], terminal=False, stage="emergency_menu", language=language)
    option = segments[2]
    if workflow_database_ready():
        try:
            create_sos_request(
                {
                    "channel": "ussd",
                    "note": f"USSD emergency option {option}",
                    "location_text": None,
                    "region": "kenya",
                    "language": language,
                    "scenario_code": None,
                    "incident_code": None,
                    "safe_mode": True,
                    "lite_mode": True,
                    "status": "opened",
                }
            )
        except Exception:
            pass
    if option == "1":
        return _response(copy["emergency_now"], terminal=True, stage="emergency_now", language=language)
    if option == "2":
        return _response(copy["emergency_medical"], terminal=True, stage="emergency_medical", language=language)
    if option == "3":
        return _response(copy["emergency_sms"], terminal=True, stage="emergency_sms", language=language)
    return _response(copy["invalid"], terminal=True, stage="invalid_emergency", language=language)
