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
package com.example.healthsync.presentation

import android.annotation.SuppressLint
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.Scaffold
import androidx.compose.material.Snackbar
import androidx.compose.material.SnackbarHost
import androidx.compose.material.Text
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Menu
import androidx.compose.material.rememberScaffoldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.res.stringResource
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.healthsync.R
import com.example.healthsync.data.HealthConnectAvailability
import com.example.healthsync.data.HealthConnectManager
import com.example.healthsync.presentation.navigation.Drawer
import com.example.healthsync.presentation.navigation.HealthConnectNavigation
import com.example.healthsync.presentation.navigation.Screen
import com.example.healthsync.presentation.theme.HealthConnectTheme
import kotlinx.coroutines.launch

const val TAG = "Health Sync"

@SuppressLint("UnusedMaterialScaffoldPaddingParameter")
@Composable
fun HealthConnectApp(healthConnectManager: HealthConnectManager) {
  HealthConnectTheme {
    val scaffoldState = rememberScaffoldState()
    val navController = rememberNavController()
    val scope = rememberCoroutineScope()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val availability by healthConnectManager.availability

    Scaffold(
      scaffoldState = scaffoldState,
      topBar = {
        TopAppBar(
          title = {
            val titleId = when (currentRoute) {
              Screen.ExerciseSessions.route -> Screen.ExerciseSessions.titleId
              Screen.InputReadings.route -> Screen.InputReadings.titleId
              Screen.DifferentialChanges.route -> Screen.DifferentialChanges.titleId
              Screen.DataSync.route -> Screen.DataSync.titleId
              else -> R.string.app_name
            }
            Text(stringResource(titleId))
          },
          navigationIcon = {
            IconButton(
              onClick = {
                if (availability == HealthConnectAvailability.INSTALLED) {
                  scope.launch {
                    scaffoldState.drawerState.open()
                  }
                }
              }
            ) {
              Icon(
                imageVector = Icons.Rounded.Menu,
                stringResource(id = R.string.menu)
              )
            }
          }
        )
      },
      drawerContent = {
        if (availability == HealthConnectAvailability.INSTALLED) {
          Drawer(
            scope = scope,
            scaffoldState = scaffoldState,
            navController = navController
          )
        }
      },
      snackbarHost = {
        SnackbarHost(it) { data -> Snackbar(snackbarData = data) }
      }
    ) {
      HealthConnectNavigation(
        healthConnectManager = healthConnectManager,
        navController = navController,
        scaffoldState = scaffoldState
      )
    }
  }
}

