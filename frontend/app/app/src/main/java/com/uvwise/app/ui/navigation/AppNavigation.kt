package com.uvwise.app.ui.navigation

import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Security
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.uvwise.app.ui.uv.AwarenessScreen
import com.uvwise.app.ui.uv.ProfileScreen
import com.uvwise.app.ui.uv.ProtectionScreen
import com.uvwise.app.ui.uv.UvDashboardScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val navBackStackEntry = navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry.value?.destination?.route

    Scaffold(
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            NavigationBar(
                containerColor = Color.White
            ) {
                NavigationBarItem(
                    selected = currentRoute == "home",
                    onClick = {
                        navController.navigate("home") {
                            popUpTo(navController.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    icon = {
                        Icon(Icons.Outlined.Home, contentDescription = "Home")
                    },
                    label = { Text("Home") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFF0001C),
                        selectedTextColor = Color(0xFFF0001C),
                        indicatorColor = Color(0xFFFBE1E3),
                        unselectedIconColor = Color.Gray,
                        unselectedTextColor = Color.Gray
                    )
                )

                NavigationBarItem(
                    selected = currentRoute == "awareness",
                    onClick = {
                        navController.navigate("awareness") {
                            popUpTo(navController.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    icon = {
                        Icon(Icons.Outlined.Info, contentDescription = "Awareness")
                    },
                    label = { Text("Awareness") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFF0001C),
                        selectedTextColor = Color(0xFFF0001C),
                        indicatorColor = Color(0xFFFBE1E3),
                        unselectedIconColor = Color.Gray,
                        unselectedTextColor = Color.Gray
                    )
                )

                NavigationBarItem(
                    selected = currentRoute == "protection",
                    onClick = {
                        navController.navigate("protection") {
                            popUpTo(navController.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    icon = {
                        Icon(Icons.Outlined.Security, contentDescription = "Protection")
                    },
                    label = { Text("Protection") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFF0001C),
                        selectedTextColor = Color(0xFFF0001C),
                        indicatorColor = Color(0xFFFBE1E3),
                        unselectedIconColor = Color.Gray,
                        unselectedTextColor = Color.Gray
                    )
                )

                NavigationBarItem(
                    selected = currentRoute == "profile",
                    onClick = {
                        navController.navigate("profile") {
                            popUpTo(navController.graph.startDestinationId) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    icon = {
                        Icon(Icons.Outlined.Person, contentDescription = "Profile")
                    },
                    label = { Text("Profile") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFFF0001C),
                        selectedTextColor = Color(0xFFF0001C),
                        indicatorColor = Color(0xFFFBE1E3),
                        unselectedIconColor = Color.Gray,
                        unselectedTextColor = Color.Gray
                    )
                )
            }
        }
    ) { innerPadding: PaddingValues ->
        NavHost(
            navController = navController,
            startDestination = "home"
        ) {
            composable("home") {
                UvDashboardScreen(innerPadding = innerPadding)
            }
            composable("awareness") {
                AwarenessScreen(innerPadding = innerPadding)
            }
            composable("protection") {
                ProtectionScreen(innerPadding = innerPadding)
            }
            composable("profile") {
                ProfileScreen(innerPadding = innerPadding)
            }
        }
    }
}