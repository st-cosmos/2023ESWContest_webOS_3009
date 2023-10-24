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

import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.material.ScaffoldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navDeepLink
import com.example.healthsync.data.HealthConnectManager
import com.example.healthsync.data.SleepSessionData
import com.example.healthsync.presentation.screen.WelcomeScreen
import com.example.healthsync.presentation.screen.changes.DifferentialChangesScreen
import com.example.healthsync.presentation.screen.changes.DifferentialChangesViewModel
import com.example.healthsync.presentation.screen.changes.DifferentialChangesViewModelFactory
import com.example.healthsync.presentation.screen.exercisesession.ExerciseSessionScreen
import com.example.healthsync.presentation.screen.exercisesession.ExerciseSessionViewModel
import com.example.healthsync.presentation.screen.exercisesession.ExerciseSessionViewModelFactory
import com.example.healthsync.presentation.screen.exercisesessiondetail.ExerciseSessionDetailScreen
import com.example.healthsync.presentation.screen.exercisesessiondetail.ExerciseSessionDetailViewModel
import com.example.healthsync.presentation.screen.exercisesessiondetail.ExerciseSessionDetailViewModelFactory
import com.example.healthsync.presentation.screen.inputreadings.InputReadingsScreen
import com.example.healthsync.presentation.screen.inputreadings.InputReadingsViewModel
import com.example.healthsync.presentation.screen.inputreadings.InputReadingsViewModelFactory
import com.example.healthsync.presentation.screen.privacypolicy.PrivacyPolicyScreen
import com.example.healthsync.showExceptionSnackbar
//add
import com.example.healthsync.presentation.screen.datasync.DataSyncScreen
import com.example.healthsync.presentation.screen.datasync.DataSyncViewModel
import com.example.healthsync.presentation.screen.datasync.DataSyncViewModelFactory
import com.example.healthsync.presentation.screen.datasyncselect.DataSyncSelectScreen
import com.example.healthsync.presentation.screen.datasyncselect.DataSyncSelectViewModel
import com.example.healthsync.presentation.screen.datasyncselect.DataSyncSelectViewModelFactory
import com.example.healthsync.presentation.screen.sleepsession.SleepSessionScreen
import com.example.healthsync.presentation.screen.sleepsession.SleepSessionViewModel
import com.example.healthsync.presentation.screen.sleepsession.SleepSessionViewModelFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Provides the navigation in the app.
 */
@Composable
fun HealthConnectNavigation(
  navController: NavHostController,
  healthConnectManager: HealthConnectManager,
  scaffoldState: ScaffoldState,
) {
  val scope = rememberCoroutineScope()
  NavHost(navController = navController, startDestination = Screen.WelcomeScreen.route) {
    val availability by healthConnectManager.availability
    composable(Screen.WelcomeScreen.route) {
      WelcomeScreen(
        healthConnectAvailability = availability,
        onResumeAvailabilityCheck = {
          healthConnectManager.checkAvailability()
        }
      )
    }
    composable(
      route = Screen.PrivacyPolicy.route,
      deepLinks = listOf(
        navDeepLink {
          action = "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE"
        }
      )
    ) {
      PrivacyPolicyScreen()
    }
    composable(Screen.ExerciseSessions.route) {
      val viewModel: ExerciseSessionViewModel = viewModel(
        factory = ExerciseSessionViewModelFactory(
          healthConnectManager = healthConnectManager
        )
      )
      val permissionsGranted by viewModel.permissionsGranted
      val sessionsList by viewModel.sessionsList
      val permissions = viewModel.permissions
      val onPermissionsResult = { viewModel.initialLoad() }
      val permissionsLauncher =
        rememberLauncherForActivityResult(viewModel.permissionsLauncher) {
          onPermissionsResult()
        }
      ExerciseSessionScreen(
        permissionsGranted = permissionsGranted,
        permissions = permissions,
        sessionsList = sessionsList,
        uiState = viewModel.uiState,
        onInsertClick = {
          viewModel.insertExerciseSession()
        },
        onDetailsClick = { uid ->
          navController.navigate(Screen.ExerciseSessionDetail.route + "/" + uid)
        },
        onError = { exception ->
          showExceptionSnackbar(scaffoldState, scope, exception)
        },
        onPermissionsResult = {
          viewModel.initialLoad()
        },
        onPermissionsLaunch = { values ->
          permissionsLauncher.launch(values)
        }
      )
    }
    composable(Screen.ExerciseSessionDetail.route + "/{$UID_NAV_ARGUMENT}") {
      val uid = it.arguments?.getString(UID_NAV_ARGUMENT)!!
      val viewModel: ExerciseSessionDetailViewModel = viewModel(
        factory = ExerciseSessionDetailViewModelFactory(
          uid = uid,
          healthConnectManager = healthConnectManager
        )
      )
      val permissionsGranted by viewModel.permissionsGranted
      val sessionMetrics by viewModel.sessionMetrics
      val permissions = viewModel.permissions
      val onPermissionsResult = { viewModel.initialLoad() }
      val permissionsLauncher =
        rememberLauncherForActivityResult(viewModel.permissionsLauncher) {
          onPermissionsResult()
        }
      ExerciseSessionDetailScreen(
        permissions = permissions,
        permissionsGranted = permissionsGranted,
        sessionMetrics = sessionMetrics,
        uiState = viewModel.uiState,
        onError = { exception ->
          showExceptionSnackbar(scaffoldState, scope, exception)
        },
        onPermissionsResult = {
          viewModel.initialLoad()
        },
        onPermissionsLaunch = { values ->
          permissionsLauncher.launch(values)
        }
      )
    }
    composable(Screen.InputReadings.route) {
      val viewModel: InputReadingsViewModel = viewModel(
        factory = InputReadingsViewModelFactory(
          healthConnectManager = healthConnectManager
        )
      )
      val permissionsGranted by viewModel.permissionsGranted
      val readingsList by viewModel.readingsList
      val permissions = viewModel.permissions
      val weeklyAvg by viewModel.weeklyAvg
      val onPermissionsResult = { viewModel.initialLoad() }
      val permissionsLauncher =
        rememberLauncherForActivityResult(viewModel.permissionsLauncher) {
          onPermissionsResult()
        }
      InputReadingsScreen(
        permissionsGranted = permissionsGranted,
        permissions = permissions,

        uiState = viewModel.uiState,
        onInsertClick = { weightInput ->
          viewModel.inputReadings(weightInput)
        },
        weeklyAvg = weeklyAvg,
        readingsList = readingsList,
        onError = { exception ->
          showExceptionSnackbar(scaffoldState, scope, exception)
        },
        onPermissionsResult = {
          viewModel.initialLoad()
        },
        onPermissionsLaunch = { values ->
          permissionsLauncher.launch(values)
        }
      )
    }
    composable(Screen.DifferentialChanges.route) {
      val viewModel: DifferentialChangesViewModel = viewModel(
        factory = DifferentialChangesViewModelFactory(
          healthConnectManager = healthConnectManager
        )
      )
      val changesToken by viewModel.changesToken
      val permissionsGranted by viewModel.permissionsGranted
      val permissions = viewModel.permissions
      val onPermissionsResult = {viewModel.initialLoad()}
      val permissionsLauncher =
        rememberLauncherForActivityResult(viewModel.permissionsLauncher) {
          onPermissionsResult()}
      DifferentialChangesScreen(
        permissionsGranted = permissionsGranted,
        permissions = permissions,
        changesEnabled = changesToken != null,
        onChangesEnable = { enabled ->
          viewModel.enableOrDisableChanges(enabled)
        },
        changes = viewModel.changes,
        changesToken = changesToken,
        onGetChanges = {
          viewModel.getChanges()
        },
        uiState = viewModel.uiState,
        onError = { exception ->
          showExceptionSnackbar(scaffoldState, scope, exception)
        },
        onPermissionsResult = {
          viewModel.initialLoad()
        },
        onPermissionsLaunch = { values ->
          permissionsLauncher.launch(values)}
      )
    }
    // send func. of Exercise Session
    composable(Screen.DataSync.route+ "/{$UID_NAV_ARGUMENT}"){
      val uid = it.arguments?.getString(UID_NAV_ARGUMENT)!!
      val viewModel: DataSyncViewModel = viewModel(
        factory = DataSyncViewModelFactory(
          uid = uid,
          healthConnectManager = healthConnectManager
        )
      )
      val permissionsGranted by viewModel.permissionsGranted
      val sessionMetrics by viewModel.sessionMetrics
      val permissions = viewModel.permissions
      val onPermissionsResult = { viewModel.initialLoad() }
      val permissionsLauncher =
        rememberLauncherForActivityResult(viewModel.permissionsLauncher) {
          onPermissionsResult()
        }

      val currentDateTime = LocalDateTime.now() // 현재 시간을 얻음
      val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss") // 원하는 날짜 및 시간 형식을 설정
      val currentDateTimeString = currentDateTime.format(formatter) // 현재 시간을 문자열로 변환

      DataSyncScreen(
        permissions = permissions,
        permissionsGranted = permissionsGranted,
        sessionMetrics = sessionMetrics,
        uiState = viewModel.uiState,
        onError = { exception ->
          showExceptionSnackbar(scaffoldState, scope, exception)
        },
        onPermissionsResult = {
          viewModel.initialLoad()
        },
        onPermissionsLaunch = { values ->
          permissionsLauncher.launch(values)
        },
        onDataSync = {  // 운동정보전송
          viewModel.dataSyncfunc(sessionMetrics.totalSteps.toString()?: "0", sessionMetrics.totalEnergyBurned.toString(),
          sessionMetrics.uid.toString(), currentDateTimeString, sessionMetrics.totalActiveTime.toString())
        }
      )
    }
    // end of Exercise Session Send
    // send func. of Exercise Session Select
    composable(Screen.SyncData.route) {
      val viewModel: DataSyncSelectViewModel = viewModel(
        factory = DataSyncSelectViewModelFactory(
          healthConnectManager = healthConnectManager
        )
      )
      val permissionsGranted by viewModel.permissionsGranted
      val sessionsList by viewModel.sessionsList
      val permissions = viewModel.permissions
      val onPermissionsResult = { viewModel.initialLoad() }
      val permissionsLauncher =
        rememberLauncherForActivityResult(viewModel.permissionsLauncher) {
          onPermissionsResult()
        }
      DataSyncSelectScreen(
        permissionsGranted = permissionsGranted,
        permissions = permissions,
        sessionsList = sessionsList,
        uiState = viewModel.uiState,
        onInsertClick = {
          viewModel.insertExerciseSession()
        },
        onDetailsClick = { uid ->
          navController.navigate(Screen.DataSync.route + "/" + uid)
        },
        onError = { exception ->
          showExceptionSnackbar(scaffoldState, scope, exception)
        },
        onPermissionsResult = {
          viewModel.initialLoad()
        },
        onPermissionsLaunch = { values ->
          permissionsLauncher.launch(values)
        }
      )
    }
    //SleepSession
    composable(Screen.SleepSessions.route) {
      val viewModel: SleepSessionViewModel = viewModel(
        factory = SleepSessionViewModelFactory(
          healthConnectManager = healthConnectManager
        )
      )
      val permissionsGranted by viewModel.permissionsGranted
      val sessionsList by viewModel.sessionsList
      val permissions = viewModel.permissions
      val onPermissionsResult = {viewModel.initialLoad()}
      val permissionsLauncher =
        rememberLauncherForActivityResult(viewModel.permissionsLauncher) {
          onPermissionsResult()}
      SleepSessionScreen(
        permissionsGranted = permissionsGranted,
        permissions = permissions,
        sessionsList = sessionsList,
        uiState = viewModel.uiState,
        onInsertClick = {
          viewModel.generateSleepData()
        },
        onError = { exception ->
          showExceptionSnackbar(scaffoldState, scope, exception)
        },
        onPermissionsResult = {
          viewModel.initialLoad()
        },
        onPermissionsLaunch = { values ->
          permissionsLauncher.launch(values)},
        onDataSync = { // 수면정보 전송
          // Loop through sessionsList and send each session's data
          for (sessionData in sessionsList) {
            // Modify this part to send sessionData to the server
            viewModel.dataSyncfunc(sessionData.dataToString())
          }
        }
      )
    }
  }
}
