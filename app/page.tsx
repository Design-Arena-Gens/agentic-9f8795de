'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Alert {
  id: string
  timestamp: Date
  location: string
  status: 'active' | 'acknowledged' | 'resolved'
  priority: 'critical' | 'high' | 'medium'
}

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isPanicActive, setIsPanicActive] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedToday: 0,
    avgResponseTime: '2.3 min'
  })

  useEffect(() => {
    setStats({
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter(a => a.status === 'active').length,
      resolvedToday: alerts.filter(a => a.status === 'resolved').length,
      avgResponseTime: '2.3 min'
    })
  }, [alerts])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      triggerPanic()
      setCountdown(null)
    }
  }, [countdown])

  const triggerPanic = () => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      location: 'Current Location',
      status: 'active',
      priority: 'critical'
    }
    setAlerts(prev => [newAlert, ...prev])
    setIsPanicActive(true)

    setTimeout(() => {
      setIsPanicActive(false)
    }, 5000)
  }

  const handlePanicPress = () => {
    setCountdown(3)
  }

  const cancelPanic = () => {
    setCountdown(null)
  }

  const updateAlertStatus = (id: string, status: Alert['status']) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, status } : alert
    ))
  }

  const clearAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🚨 Panic Button Dashboard</h1>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot}></span>
          System Active
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalAlerts}</div>
          <div className={styles.statLabel}>Total Alerts</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.critical}`}>{stats.activeAlerts}</div>
          <div className={styles.statLabel}>Active Alerts</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.success}`}>{stats.resolvedToday}</div>
          <div className={styles.statLabel}>Resolved Today</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.avgResponseTime}</div>
          <div className={styles.statLabel}>Avg Response</div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.panicSection}>
          <div className={styles.panicCard}>
            {countdown !== null ? (
              <div className={styles.countdownContainer}>
                <div className={styles.countdownNumber}>{countdown}</div>
                <p className={styles.countdownText}>Emergency alert activating...</p>
                <button onClick={cancelPanic} className={styles.cancelButton}>
                  CANCEL
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handlePanicPress}
                  className={`${styles.panicButton} ${isPanicActive ? styles.active : ''}`}
                  disabled={isPanicActive}
                >
                  {isPanicActive ? 'ALERT SENT!' : 'PANIC BUTTON'}
                </button>
                <p className={styles.panicHint}>Press and hold for 3 seconds to activate emergency alert</p>
              </>
            )}
          </div>
        </div>

        <div className={styles.alertsSection}>
          <div className={styles.alertsHeader}>
            <h2>Recent Alerts</h2>
            <span className={styles.badge}>{alerts.length}</span>
          </div>

          <div className={styles.alertsList}>
            {alerts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>✓</div>
                <p>No active alerts</p>
                <span className={styles.emptySubtext}>All systems operational</span>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`${styles.alertCard} ${styles[alert.status]}`}>
                  <div className={styles.alertHeader}>
                    <span className={`${styles.priorityBadge} ${styles[alert.priority]}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className={styles.alertTime}>
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className={styles.alertBody}>
                    <div className={styles.alertIcon}>🚨</div>
                    <div className={styles.alertDetails}>
                      <h3>Emergency Alert Triggered</h3>
                      <p>Location: {alert.location}</p>
                      <p className={styles.alertStatus}>Status: {alert.status}</p>
                    </div>
                  </div>

                  <div className={styles.alertActions}>
                    {alert.status === 'active' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'acknowledged')}
                        className={styles.ackButton}
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status === 'acknowledged' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        className={styles.resolveButton}
                      >
                        Resolve
                      </button>
                    )}
                    {alert.status === 'resolved' && (
                      <button
                        onClick={() => clearAlert(alert.id)}
                        className={styles.clearButton}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
