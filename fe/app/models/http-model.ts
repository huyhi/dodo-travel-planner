export interface TravelRequest {
  from_place: string
  to_place: string
  from_date: string
  to_date: string
  people_num: number
  others: string
}

export interface Airport {
  code: string
  name: string
  city: string
}

export interface FlightSegment {
  departure_airport: Airport
  arrival_airport: Airport
  departure_time: string
  arrival_time: string
  duration: number
}

export interface Airline {
  name: string
  code: string
  logo: string
  flight_no: number
}

export interface Price {
  total: number
  currency: string
  base_fare: number
  tax: number
}

export interface FlightOption {
  outbound: FlightSegment
  return: FlightSegment
  airline: Airline
  price: Price
  stops: number
  token?: string
}

export interface FlightSearchResponse {
  code: number
  message: string
  data: FlightOption[]
}