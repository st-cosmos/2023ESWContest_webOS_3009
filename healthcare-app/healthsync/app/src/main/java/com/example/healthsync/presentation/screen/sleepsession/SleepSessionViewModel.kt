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
package com.example.healthsync.presentation.screen.sleepsession

//DataSync import
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

import android.os.RemoteException
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.healthsync.data.HealthConnectManager
import com.example.healthsync.data.SleepSessionData
import kotlinx.coroutines.launch
import java.io.IOException
import java.util.UUID
import com.example.healthsync.R

class SleepSessionViewModel(private val healthConnectManager: HealthConnectManager) :
    ViewModel() {

    val permissions = setOf(
        HealthPermission.getReadPermission(SleepSessionRecord::class),
        HealthPermission.getWritePermission(SleepSessionRecord::class)
    )

    var permissionsGranted = mutableStateOf(false)
        private set

    var sessionsList: MutableState<List<SleepSessionData>> = mutableStateOf(listOf())
        private set

    var uiState: UiState by mutableStateOf(UiState.Uninitialized)
        private set

    val permissionsLauncher = healthConnectManager.requestPermissionsActivityContract()

    fun initialLoad() {
        viewModelScope.launch {
            tryWithPermissionsCheck {
                sessionsList.value = healthConnectManager.readSleepSessions()
            }
        }
    }

    fun dataSyncfunc(
        incomnotes: String,
        //incomSleepStage: String

    ) {
        sendUserDataToServer(incomnotes,/*incomSleepStage*/)

    }

    //end of send button

    //start of send to server
    data class SleepUserData(val SleepSessions: String, /*val SleepStage: String*/)

    interface ApiService {
        @POST("/api/user")
        fun createUser(@Body sleepUserData: SleepUserData): Call<Void>
    }

    fun sendUserDataToServer(SleepSessions: String, /*SleepStage:String*/) {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://192.168.206.37:9002")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)

        val sleepUserData = SleepUserData(SleepSessions, /*SleepStage*/)

        val call = apiService.createUser(sleepUserData)

        call.enqueue(object : retrofit2.Callback<Void> {
            override fun onResponse(call: Call<Void>, response: retrofit2.Response<Void>) {
                if (response.isSuccessful) {
                    println("User created successfully!")
                    println("Sucess: SleepSessions: $SleepSessions, SleepStage: ")
                } else {
                    println("Failed to create user. Code: ${response.code()}")
                    println("Failed, But: SleepSessions: $SleepSessions, SleepStage: ")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                println("Error: ${t.message}")
            }
        })
    }

    //end of send to server

    fun generateSleepData() {
        viewModelScope.launch {
            tryWithPermissionsCheck {
                // Delete all existing sleep data before generating new random sleep data.
                healthConnectManager.deleteAllSleepData()
                healthConnectManager.generateSleepData()
                sessionsList.value = healthConnectManager.readSleepSessions()
            }
        }
    }

    /**
     * Provides permission check and error handling for Health Connect suspend function calls.
     *
     * Permissions are checked prior to execution of [block], and if all permissions aren't granted
     * the [block] won't be executed, and [permissionsGranted] will be set to false, which will
     * result in the UI showing the permissions button.
     *
     * Where an error is caught, of the type Health Connect is known to throw, [uiState] is set to
     * [UiState.Error], which results in the snackbar being used to show the error message.
     */
    private suspend fun tryWithPermissionsCheck(block: suspend () -> Unit) {
        permissionsGranted.value = healthConnectManager.hasAllPermissions(permissions)
        uiState = try {
            if (permissionsGranted.value) {
                block()
            }
            UiState.Done
        } catch (remoteException: RemoteException) {
            UiState.Error(remoteException)
        } catch (securityException: SecurityException) {
            UiState.Error(securityException)
        } catch (ioException: IOException) {
            UiState.Error(ioException)
        } catch (illegalStateException: IllegalStateException) {
            UiState.Error(illegalStateException)
        }
    }

    sealed class UiState {
        object Uninitialized : UiState()
        object Done : UiState()

        // A random UUID is used in each Error object to allow errors to be uniquely identified,
        // and recomposition won't result in multiple snackbars.
        data class Error(val exception: Throwable, val uuid: UUID = UUID.randomUUID()) : UiState()
    }
}

class SleepSessionViewModelFactory(
    private val healthConnectManager: HealthConnectManager
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(SleepSessionViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return SleepSessionViewModel(
                healthConnectManager = healthConnectManager
            ) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
