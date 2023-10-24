/*
 * Copyright 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.healthsync.data

import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.SpeedRecord
import androidx.health.connect.client.units.Energy
import androidx.health.connect.client.units.Length
import androidx.health.connect.client.units.Velocity
import java.time.Duration

/**
 * Represents data, both aggregated and raw, associated with a single exercise session. Used to
 * collate results from aggregate and raw reads from Health Connect in one object.
 */
data class ExerciseSessionData(
    val uid: String,
    val totalActiveTime: Duration? = null,
    val totalSteps: Long? = null,
    val totalDistance: Length? = null,
    val totalEnergyBurned: Energy? = null,
    val minHeartRate: Long? = null,
    val maxHeartRate: Long? = null,
    val avgHeartRate: Long? = null,
    val heartRateSeries: List<HeartRateRecord> = listOf(),
    val minSpeed: Velocity? = null,
    val maxSpeed: Velocity? = null,
    val avgSpeed: Velocity? = null,
    val speedRecord: List<SpeedRecord> = listOf(),
){
    /*
    fun heartRateSeriesToString(): String {
        return heartRateSeries.joinToString("\n") { record ->
            "Time: ${record.startTime}\n" +
                    "Value: ${record./*데이터 형태 파악 불가..*/}\n\n"
        }
    }

    fun speedRecordToString(): String {
        return speedRecord.joinToString("\n") { record ->
            "Time: ${record.time}\n" +
                    "Value: ${record./*데이터 형태 파악 불가..*/}\n\n"
        }
    }
    */
    fun dataToString(): String {
        return "UID: $uid\n" +
                "Total Active Time: $totalActiveTime\n" +
                "Total Steps: $totalSteps\n" +
                "Total Distance: $totalDistance\n" +
                "Total Energy Burned: $totalEnergyBurned\n" +
                "Min Heart Rate: $minHeartRate\n" +
                "Max Heart Rate: $maxHeartRate\n" +
                "Avg Heart Rate: $avgHeartRate\n\n" +
                //"Heart Rate Series:\n${heartRateSeriesToString()}" +
                "Min Speed: $minSpeed\n" +
                "Max Speed: $maxSpeed\n" +
                "Avg Speed: $avgSpeed\n\n" }
               // "Speed Record:\n${speedRecordToString()}"
    }

