import os
import requests
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


def fetch_flight_info(
    from_place: str, 
    to_place: str, 
    from_date: str,
    to_date: str,
) -> List[Dict[str, Any]]:
    """
    Fetch flight information from Booking.com RapidAPI
    
    Args:
        from_place: Departure city code (e.g., 'TYO.CITY')
        to_place: Arrival city code (e.g., 'SHA.CITY')
        from_date: Departure date in YYYY-MM-DD format
        to_date: Return date in YYYY-MM-DD format
    
    Returns:
        List of first 3 flight offers with relevant information
    """
    url = "https://booking-com.p.rapidapi.com/v1/flights/search"
    
    headers = {
        "x-rapidapi-host": "booking-com.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPID_API_KEY")
    }
    
    params = {
        "from_code": f'{from_place}.CITY',
        "to_code": f'{to_place}.CITY',
        "depart_date": from_date,
        "return_date": to_date,
        "adults": 1,
        "cabin_class": "ECONOMY",
        "flight_type": "ROUNDTRIP",
        "currency": "CNY",
        "locale": "zh-cn",
        "page_number": 0,
        "order_by": "BEST"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract flight offers
        airlines = data.get("aggregation", {}).get("airlines", [])
        flight_offers = data.get("flightOffers", [])
        
        # Process and return first 3 flights
        processed_flights = []
        for i, offer in enumerate(flight_offers[:3]):
            flight_info = _extract_flight_info(offer, airlines)
            processed_flights.append(flight_info)
        
        return processed_flights
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching flight data: {e}")
        return []
    except (KeyError, ValueError) as e:
        logger.error(f"Error parsing flight data: {e}")
        return []


def _extract_flight_info(offer: Dict[str, Any], airlines: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Extract relevant flight information from a flight offer
    
    Args:
        offer: Single flight offer from the API response
    
    Returns:
        Processed flight information dictionary
    """
    airline_mapping = dict()
    for airline in airlines:
        airline_mapping[airline.get("iataCode")] = {
            "name": airline.get("name"),
            "logo": airline.get("logoUrl")
        }

    # Extract outbound segment (first segment)
    outbound_segment = offer.get("segments", [{}])[0] if offer.get("segments") else {}
    
    # Extract return segment (second segment if exists)
    return_segment = offer.get("segments", [{}])[1] if len(offer.get("segments", [])) > 1 else {}
    
    # Extract price information
    price_breakdown = offer.get("priceBreakdown", {})
    total_price = price_breakdown.get("total", {})
    
    # Extract airline information from the first leg
    first_leg = outbound_segment.get("legs", [{}])[0] if outbound_segment.get("legs") else {}
    flight_info = first_leg.get("flightInfo", {})
    carrier_info = flight_info.get("carrierInfo", {})

    flight_number = flight_info.get("flightNumber", "")
    airline_code = carrier_info.get("operatingCarrier", "")

    airline_info = airline_mapping.get(airline_code, {})
    
    flight_info = {
        "outbound": {
            "departure_airport": {
                "code": outbound_segment.get("departureAirport", {}).get("code", ""),
                "name": outbound_segment.get("departureAirport", {}).get("name", ""),
                "city": outbound_segment.get("departureAirport", {}).get("cityName", "")
            },
            "arrival_airport": {
                "code": outbound_segment.get("arrivalAirport", {}).get("code", ""),
                "name": outbound_segment.get("arrivalAirport", {}).get("name", ""),
                "city": outbound_segment.get("arrivalAirport", {}).get("cityName", "")
            },
            "departure_time": outbound_segment.get("departureTime", ""),
            "arrival_time": outbound_segment.get("arrivalTime", ""),
            "duration": outbound_segment.get("totalTime", 0)  # in minutes
        },
        "return": {
            "departure_airport": {
                "code": return_segment.get("departureAirport", {}).get("code", ""),
                "name": return_segment.get("departureAirport", {}).get("name", ""),
                "city": return_segment.get("departureAirport", {}).get("cityName", "")
            },
            "arrival_airport": {
                "code": return_segment.get("arrivalAirport", {}).get("code", ""),
                "name": return_segment.get("arrivalAirport", {}).get("name", ""),
                "city": return_segment.get("arrivalAirport", {}).get("cityName", "")
            },
            "departure_time": return_segment.get("departureTime", ""),
            "arrival_time": return_segment.get("arrivalTime", ""),
            "duration": return_segment.get("totalTime", 0)  # in minutes
        } if return_segment else None,
        "airline": {
            "code": airline_code,
            "flight_no": flight_number,
            "name": airline_info.get("name", ""),
            "logo": airline_info.get("logo", "")
        },
        "price": {
            "total": total_price.get("units", 0) + (total_price.get("nanos", 0) / 1000000000),
            "currency": total_price.get("currencyCode", "CNY"),
            "base_fare": price_breakdown.get("baseFare", {}).get("units", 0) + 
                        (price_breakdown.get("baseFare", {}).get("nanos", 0) / 1000000000),
            "tax": price_breakdown.get("tax", {}).get("units", 0) + 
                  (price_breakdown.get("tax", {}).get("nanos", 0) / 1000000000)
        },
        "stops": len(outbound_segment.get("legs", [])) - 1,  # Number of stops
    }
    
    return flight_info
