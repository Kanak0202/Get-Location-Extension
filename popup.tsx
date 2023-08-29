//axios
import axios from "axios"
import React, { useEffect, useState } from "react"

import "./style.css"

const url = "https://api.ipify.org?format=json"
const token = process.env.PLASMO_PUBLIC_REACT_APP_ACCESS_TOKEN as string
console.log(token)

interface LocationData {
  ip: string
  city: string
  country: string
}

function IndexPopup() {
  const [ip, setIp] = useState<string>("")
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [country, setCountry] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [textVisible, setTextVisible] = useState<boolean>(false)

  const fetchIp = async () => {
    try {
      setLoading(true)
      const response = await axios(url)
      const data = response.data
      console.log(response)

      if (data) {
        setIp(data.ip)
        getLocation()
        setLoading(false)
      }
    } catch (error) {
      console.log(error.response)
    }
  }

  const getLocation = async () => {
    try {
      const response = await axios.get(`https://ipinfo.io/${ip}?token=${token}`)
      const jsonResponse = response.data
      setLocationData(jsonResponse)
      const ctr = new Intl.DisplayNames(["en"], {
        type: "region"
      })
      setCountry(ctr.of(jsonResponse.country))
      setTextVisible(true)
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <div className="bg-blue-100 h-screen flex items-center justify-center">
      <div className="bg-white to-90%p-8 rounded-lg shadow-md w-[500px] h-[500px] flex flex-col justify-center items-center border-solid border-2 border-black-500 px-[20px]">
        {locationData && textVisible ? (
          <p
            style={{ lineHeight: "50px" }}
            className="text-center mb-4 text-lg font-bold text-5xl pb-[50px] text-black leading-50 fade-in-up" // Add the animation class
          >
            Your country is{" "}
            <span className="text-blue-600 text-5xl">{country}</span> and city
            is{" "}
            <span className="text-blue-900 text-5xl">{locationData.city}</span>.
          </p>
        ) : (
          <></>
        )}
        <button
          type="button"
          className="mt-4 px-4 py-2 font-medium text-2xl text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => fetchIp()}>
          {loading === false ? "Show my location" : "Loading..."}
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
