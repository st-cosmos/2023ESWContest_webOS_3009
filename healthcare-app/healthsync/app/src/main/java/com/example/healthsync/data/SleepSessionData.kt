package com.example.healthsync.data


import androidx.health.connect.client.records.SleepSessionRecord
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset

/**
 * Represents sleep data, raw, aggregated and sleep stages, for a given [SleepSessionRecord].
 */
data class SleepSessionData(
    val uid: String,
    val title: String?,
    val notes: String?,
    val startTime: Instant,
    val startZoneOffset: ZoneOffset?,
    val endTime: Instant,
    val endZoneOffset: ZoneOffset?,
    val duration: Duration?,
    val stages: List<SleepSessionRecord.Stage> = listOf()
){
    fun stagesToString(): String {
        return stages.joinToString("\n") { stage ->
            "Stage: ${stage.stage}\n" +
                    "Start Time: ${stage.startTime}\n" +
                    "End Time: ${stage.endTime}\n\n"
        }
    }

    fun dataToString(): String {
        return "UID: $uid\n" +
                "Title: $title\n" +
                "Notes: $notes\n" +
                "Start Time: $startTime\n" +
                "Start Zone Offset: $startZoneOffset\n" +
                "End Time: $endTime\n" +
                "End Zone Offset: $endZoneOffset\n" +
                "Duration: $duration\n\n" +
                "Stages:\n${stagesToString()}"
    }
}
