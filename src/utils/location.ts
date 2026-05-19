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

export function requestLocationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    uni.authorize({
      scope: 'scope.userLocation',
      success: () => resolve(true),
      fail: () => resolve(false),
    })
  })
}
