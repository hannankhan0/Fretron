export const userOverviewStats = [
  { label: "Active bookings", value: "12", change: "+3 this week" },
  { label: "Shipment posts", value: "08", change: "2 awaiting response" },
  { label: "Completed deliveries", value: "41", change: "96% completion rate" },
  { label: "Pending responses", value: "05", change: "2 new matches today" },
];

export const userRecentActivity = [
  { title: "Karachi to Lahore electronics shipment matched", time: "12 minutes ago", status: "Matched" },
  { title: "Driver accepted fragile document delivery", time: "1 hour ago", status: "Accepted" },
  { title: "Booking FR-492 reached in transit stage", time: "4 hours ago", status: "In Transit" },
  { title: "Raw material shipment delivered successfully", time: "Yesterday", status: "Delivered" },
];

export const shipmentPosts = [
  {
    id: "SHP-1001",
    pickup: "Karachi",
    destination: "Lahore",
    category: "Electronics",
    weight: "180 kg",
    timing: "24 Mar, 6:00 PM",
    status: "published",
    matches: 6,
  },
  {
    id: "SHP-1002",
    pickup: "Islamabad",
    destination: "Rawalpindi",
    category: "Documents",
    weight: "4 kg",
    timing: "25 Mar, 10:30 AM",
    status: "booked",
    matches: 1,
  },
  {
    id: "SHP-1003",
    pickup: "Faisalabad",
    destination: "Multan",
    category: "Textile samples",
    weight: "36 kg",
    timing: "26 Mar, 2:00 PM",
    status: "draft",
    matches: 0,
  },
];

export const availableRoutes = [
  {
    id: "RT-219",
    provider: "Adeel Logistics",
    route: "Karachi → Lahore",
    departure: "24 Mar · 8:00 PM",
    arrival: "25 Mar · 10:00 AM",
    capacity: "420 kg free",
    vehicle: "Mazda Truck",
    price: "PKR 18,000",
    rating: "4.8",
    notes: "Handles fragile and sealed cargo. Same-day pickup within Karachi.",
  },
  {
    id: "RT-220",
    provider: "Swift Haul Network",
    route: "Islamabad → Peshawar",
    departure: "25 Mar · 7:30 AM",
    arrival: "25 Mar · 1:00 PM",
    capacity: "160 kg free",
    vehicle: "Hiace",
    price: "PKR 7,500",
    rating: "4.7",
    notes: "Fast route, suited for boxes and medium-sized commercial parcels.",
  },
  {
    id: "RT-221",
    provider: "Bilal Cargo Lines",
    route: "Lahore → Faisalabad",
    departure: "25 Mar · 1:00 PM",
    arrival: "25 Mar · 4:30 PM",
    capacity: "90 kg free",
    vehicle: "Pickup",
    price: "PKR 4,800",
    rating: "4.9",
    notes: "Ideal for urgent local and intercity SME consignments.",
  },
];

export const activeBookings = [
  {
    id: "BK-8341",
    shipment: "Consumer electronics",
    route: "Karachi → Lahore",
    provider: "Adeel Logistics",
    status: "In Transit",
    updatedAt: "Updated 18 min ago",
  },
  {
    id: "BK-8342",
    shipment: "Confidential legal documents",
    route: "Islamabad → Rawalpindi",
    provider: "CityExpress Driver",
    status: "Booked",
    updatedAt: "Pickup scheduled for 9:30 AM",
  },
  {
    id: "BK-8343",
    shipment: "Medical accessories",
    route: "Lahore → Faisalabad",
    provider: "Bilal Cargo Lines",
    status: "Requested",
    updatedAt: "Awaiting driver confirmation",
  },
];

export const pastBookings = [
  { id: "BK-8120", route: "Karachi → Hyderabad", outcome: "Delivered", date: "17 Mar", cost: "PKR 3,800" },
  { id: "BK-8076", route: "Lahore → Gujranwala", outcome: "Delivered", date: "14 Mar", cost: "PKR 4,250" },
  { id: "BK-8012", route: "Islamabad → Lahore", outcome: "Cancelled", date: "09 Mar", cost: "PKR 0" },
];

export const userNotifications = [
  { title: "New matching route found for SHP-1001", body: "Adeel Logistics posted a Karachi to Lahore route with enough capacity.", time: "10 min ago", type: "match" },
  { title: "Booking BK-8341 moved to In Transit", body: "Driver has confirmed pickup and shipment is now moving to destination.", time: "18 min ago", type: "status" },
  { title: "Admin notice: festive schedule update", body: "Intercity deliveries may face slight delay on 27 Mar due to route congestion.", time: "Today", type: "notice" },
];

export const userReviews = [
  { driver: "Adeel Logistics", route: "Karachi → Hyderabad", rating: "5.0", comment: "Excellent communication and safe delivery." },
  { driver: "Bilal Cargo Lines", route: "Lahore → Faisalabad", rating: "4.8", comment: "Reached on time and cargo was handled properly." },
];

export const driverOverviewStats = [
  { label: "Active route posts", value: "06", change: "2 routes filling fast" },
  { label: "Active bookings", value: "09", change: "4 pickups today" },
  { label: "Capacity utilization", value: "76%", change: "+9% from last week" },
  { label: "Completed trips", value: "33", change: "4.9 average rating" },
  { label: "Pending opportunities", value: "14", change: "Across your preferred lanes" },
];

export const routePosts = [
  { id: "RT-219", route: "Karachi → Lahore", departure: "24 Mar · 8:00 PM", capacity: "420 kg", vehicle: "Mazda Truck", status: "published", bookings: 3 },
  { id: "RT-222", route: "Lahore → Islamabad", departure: "25 Mar · 7:00 AM", capacity: "130 kg", vehicle: "Hiace", status: "partially booked", bookings: 2 },
  { id: "RT-223", route: "Multan → Karachi", departure: "26 Mar · 9:30 PM", capacity: "600 kg", vehicle: "Truck", status: "draft", bookings: 0 },
];

export const shipmentOpportunities = [
  { id: "SHP-2001", shipper: "Muneeb Traders", route: "Karachi → Lahore", parcel: "Packaging material", weight: "220 kg", timing: "Pickup by 24 Mar night", budget: "PKR 16,000", urgency: "High" },
  { id: "SHP-2002", shipper: "Nexa Pharmacy", route: "Lahore → Islamabad", parcel: "Medical accessories", weight: "95 kg", timing: "25 Mar morning", budget: "PKR 8,500", urgency: "Medium" },
  { id: "SHP-2003", shipper: "City Law Associates", route: "Islamabad → Rawalpindi", parcel: "Sealed documents", weight: "3 kg", timing: "Today before 4 PM", budget: "PKR 1,800", urgency: "Urgent" },
];

export const activeCargo = [
  { id: "CG-301", shipment: "Consumer electronics", route: "Karachi → Lahore", shipper: "TechMart Wholesale", status: "Picked Up", updatedAt: "Picked 20 min ago" },
  { id: "CG-302", shipment: "Medical accessories", route: "Lahore → Islamabad", shipper: "Nexa Pharmacy", status: "Accepted", updatedAt: "Pickup scheduled" },
  { id: "CG-303", shipment: "Industrial spare parts", route: "Faisalabad → Multan", shipper: "Prime Textile Works", status: "In Transit", updatedAt: "ETA 3:30 PM" },
];

export const tripHistory = [
  { id: "TR-9001", route: "Karachi → Hyderabad", result: "Completed", date: "17 Mar", earnings: "PKR 5,400" },
  { id: "TR-8992", route: "Lahore → Sialkot", result: "Completed", date: "16 Mar", earnings: "PKR 4,900" },
  { id: "TR-8973", route: "Islamabad → Peshawar", result: "Cancelled", date: "12 Mar", earnings: "PKR 0" },
];

export const driverReviews = [
  { customer: "TechMart Wholesale", rating: "5.0", note: "Very reliable and professional pickup handling." },
  { customer: "Prime Textile Works", rating: "4.9", note: "Status updates were timely and delivery reached intact." },
  { customer: "Nexa Pharmacy", rating: "4.8", note: "Vehicle was clean and temperature-sensitive boxes were handled carefully." },
];
