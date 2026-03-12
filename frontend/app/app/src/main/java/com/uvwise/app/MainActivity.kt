package com.uvwise.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.uvwise.app.ui.theme.UVWiseTheme
import com.uvwise.app.ui.uv.UvDashboardScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            UVWiseTheme {
                UvDashboardScreen()
            }
        }
    }
}