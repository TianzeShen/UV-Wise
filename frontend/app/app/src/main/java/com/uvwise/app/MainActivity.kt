package com.uvwise.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.uvwise.app.ui.navigation.AppNavigation
import com.uvwise.app.ui.theme.UVWiseTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            UVWiseTheme {
                AppNavigation()
            }
        }
    }
}