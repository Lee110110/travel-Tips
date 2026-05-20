import type { UserLocation } from '@/types/city'

export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          timestamp: Date.now(),
        })
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// Fallback: use IP-based geolocation when GPS is unavailable (e.g. HTTP on H5)
export function getIPLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://ipapi.co/json/',
      success: (res: any) => {
        const data = res.data
        if (data?.latitude && data?.longitude) {
          resolve({
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: Date.now(),
          })
        } else {
          reject(new Error('IP定位数据无效'))
        }
      },
      fail: () => reject(new Error('IP定位请求失败')),
    })
  })
}

export function requestLocationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    uni.authorize({
      scope: 'scope.userLocation',
      success: () => resolve(true),
      fail: () => resolve(false),
    })
  })
}
