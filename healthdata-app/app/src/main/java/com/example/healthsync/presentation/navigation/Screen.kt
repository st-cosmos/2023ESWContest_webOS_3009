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
package com.example.healthsync.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.example.healthsync.R

const val UID_NAV_ARGUMENT = "uid"

/**
 * Represent all Screens in the app.
 *
 * @param route The route string used for Compose navigation
 * @param titleId The ID of the string resource to display as a title
 * @param hasMenuItem Whether this Screen should be shown as a menu item in the left-hand menu (not
 *     all screens in the navigation graph are intended to be directly reached from the menu).
 */
enum class Screen(val route: String, val titleId: Int, val hasMenuItem: Boolean = true) {
  //Soon, add total sending func.
  WelcomeScreen("welcome_screen", R.string.welcome_screen, false),

  //Original Exercise session
  ExerciseSessions("exercise_sessions", R.string.exercise_sessions),
  ExerciseSessionDetail("exercise_session_detail", R.string.exercise_session_detail, false),

  //For Weight?
  InputReadings("input_readings", R.string.input_readings),
  DifferentialChanges("differential_changes", R.string.differential_changes),

  //Page, Func. Sync Exercise Session
  DataSync("data_sync",R.string.data_sync,false),

  //Page, Select Sync Exercise Session
  SyncData("data_sync_select",R.string.data_sync_select),

  //For Sync Sleep Session
  SleepSessions("sleep_sessions", R.string.sleep_sessions),
  SleepSessionDetail("sleep_session_detail", R.string.sleep_session_detail, false),

  //Never mind?
  PrivacyPolicy("privacy_policy", R.string.privacy_policy, false)
}
