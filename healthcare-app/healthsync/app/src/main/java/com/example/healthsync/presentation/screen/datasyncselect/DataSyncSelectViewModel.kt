package com.example.healthsync.presentation.screen.datasyncselect

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
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.TotalCaloriesBurnedRecord
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.healthsync.data.HealthConnectManager
import java.io.IOException
import java.time.Duration
import java.time.Instant
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.UUID
import kotlin.random.Random
import kotlinx.coroutines.launch

class DataSyncSelectViewModel(private val healthConnectManager: HealthConnectManager) :
    ViewModel() {
    val permissions = setOf(
        HealthPermission.getWritePermission(ExerciseSessionRecord::class),
        HealthPermission.getReadPermission(ExerciseSessionRecord::class),
        HealthPermission.getWritePermission(StepsRecord::class),
        HealthPermission.getWritePermission(TotalCaloriesBurnedRecord::class),
        HealthPermission.getWritePermission(HeartRateRecord::class)
    )

    var permissionsGranted = mutableStateOf(false)
        private set

    var sessionsList: MutableState<List<ExerciseSessionRecord>> = mutableStateOf(listOf())
        private set

    var uiState: UiState by mutableStateOf(UiState.Uninitialized)
        private set

    val permissionsLauncher = healthConnectManager.requestPermissionsActivityContract()

    fun initialLoad() {
        viewModelScope.launch {
            tryWithPermissionsCheck {
                readExerciseSessions()
            }
        }
    }

    fun insertExerciseSession() {
        viewModelScope.launch {
            tryWithPermissionsCheck {
                val startOfDay = ZonedDateTime.now().truncatedTo(ChronoUnit.DAYS)
                val latestStartOfSession = ZonedDateTime.now().minusMinutes(30)
                val offset = Random.nextDouble()

                // Generate random start time between the start of the day and (now - 30mins).
                val startOfSession = startOfDay.plusSeconds(
                    (Duration.between(startOfDay, latestStartOfSession).seconds * offset).toLong()
                )
                val endOfSession = startOfSession.plusMinutes(30)

                healthConnectManager.writeExerciseSession(startOfSession, endOfSession)
                readExerciseSessions()
            }
        }
    }

    private suspend fun readExerciseSessions() {
        val startOfDay = ZonedDateTime.now().truncatedTo(ChronoUnit.DAYS)
        val now = Instant.now()

        sessionsList.value = healthConnectManager.readExerciseSessions(startOfDay.toInstant(), now)
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

    //send button
    fun dataSyncfunc(
        incomtotalsteps: String,
        incomtotalcal: String,
    ) {
        sendUserDataToServer(incomtotalsteps, incomtotalcal)

    }

    //end of send button

    //start of send to server
    data class UserData(val totalsteps: String, val totalcal: String)

    interface ApiService {
        @POST("/api/user")
        fun createUser(@Body userData: UserData): Call<Void>
    }

    fun sendUserDataToServer(totalsteps: String, totalcal: String) {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.50.9.0:9002")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)

        val userData = UserData(totalsteps, totalcal)

        val call = apiService.createUser(userData)

        call.enqueue(object : retrofit2.Callback<Void> {
            override fun onResponse(call: Call<Void>, response: retrofit2.Response<Void>) {
                if (response.isSuccessful) {
                    println("User created successfully!")
                    println("Sucess: incomtotalsteps: $totalsteps, incomtotalcal: $totalcal")
                } else {
                    println("Failed to create user. Code: ${response.code()}")
                    println("Failed, But: incomtotalsteps: $totalsteps, incomtotalcal: $totalcal")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                println("Error: ${t.message}")
            }
        })
    }

}


class DataSyncSelectViewModelFactory(
    private val healthConnectManager: HealthConnectManager,
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DataSyncSelectViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return DataSyncSelectViewModel(
                healthConnectManager = healthConnectManager
            ) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
