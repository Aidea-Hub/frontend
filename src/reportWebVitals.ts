import { getAnalytics, logEvent } from 'firebase/analytics'
import { ReportHandler } from 'web-vitals'
import firebase from './config/firebase'

const analytics = getAnalytics(firebase)

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(metric => {
        onPerfEntry(metric)
        logEvent(analytics, 'web_vitals', {
          name: 'CLS',
          value: metric.value.toFixed(2),
          delta: metric.delta,
        })
      })
      getFID(metric => {
        onPerfEntry(metric)
        logEvent(analytics, 'web_vitals', {
          name: 'FID',
          value: metric.value.toFixed(2),
          delta: metric.delta,
        })
      })
      getFCP(metric => {
        onPerfEntry(metric)
        logEvent(analytics, 'web_vitals', {
          name: 'FCP',
          value: metric.value.toFixed(2),
          delta: metric.delta,
        })
      })
      getLCP(metric => {
        onPerfEntry(metric)
        logEvent(analytics, 'web_vitals', {
          name: 'LCP',
          value: metric.value.toFixed(2),
          delta: metric.delta,
        })
      })
      getTTFB(metric => {
        onPerfEntry(metric)
        logEvent(analytics, 'web_vitals', {
          name: 'TTFB',
          value: metric.value.toFixed(2),
          delta: metric.delta,
        })
      })
    })
  }
}
export default reportWebVitals
