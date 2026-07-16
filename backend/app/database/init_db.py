import json
import random
from datetime import datetime, timedelta
from app.database.connection import engine, SessionLocal, Base
from app.models.user import User
from app.models.order import Order
from app.models.ticket import Ticket
from app.models.product import Product
from app.models.chat_history import ChatHistory
from app.utils.auth import hash_password
from app.rag.vector_store import get_vector_store

def init_db():
    print("Resetting database tables for fresh enterprise data initialization...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        default_pw = hash_password("password")
        print("Seeding 100+ realistic customer accounts...")
        
        # Core pre-seeded sandbox accounts
        customer_sandbox = User(
            id=1,
            name="John Doe",
            email="customer@example.com",
            password=default_pw,
            role="customer",
            created_at=now - timedelta(days=60)
        )
        customer_two = User(
            id=2,
            name="Sarah Connor",
            email="sarah@example.com",
            password=default_pw,
            role="customer",
            created_at=now - timedelta(days=90)
        )
        db.add_all([customer_sandbox, customer_two])

        # 100 additional realistic customers
        first_names = [
            "Marcus", "Elena", "David", "Ayesha", "Robert", "Sophia", "Liam", "Olivia", "Noah", "Emma",
            "James", "Ava", "Benjamin", "Mia", "Lucas", "Charlotte", "Henry", "Amelia", "Alexander", "Harper",
            "Daniel", "Evelyn", "Matthew", "Abigail", "Jackson", "Emily", "Sebastian", "Elizabeth", "Aiden", "Sofia",
            "Samuel", "Avery", "Joseph", "Ella", "David", "Scarlett", "Carter", "Grace", "Wyatt", "Chloe",
            "Jayden", "Victoria", "John", "Riley", "Luke", "Zoey", "Anthony", "Penelope", "Isaac", "Layla",
            "Lincoln", "Lillian", "Joshua", "Nora", "Christopher", "Lily", "Andrew", "Hannah", "Theodore", "Addison",
            "Caleb", "Eleanor", "Ryan", "Natalie", "Asher", "Luna", "Nathan", "Savannah", "Thomas", "Brooklyn",
            "Leo", "Leah", "Isaiah", "Zoe", "Charles", "Stella", "Josiah", "Price", "Hudson", "Violet",
            "Christian", "Aurora", "Hunter", "Savannah", "Aaron", "Claire", "Eli", "Skylar", "Landon", "Lucy",
            "Connor", "Paisley", "Ezra", "Everly", "Julian", "Anna", "Cameron", "Caroline", "Brayden", "Genesis"
        ]
        last_names = [
            "Chen", "Rostova", "Sterling", "Patel", "Taylor", "Martinez", "O'Connor", "Wang", "Williams", "Davis",
            "Wilson", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Robinson",
            "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
            "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
            "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
            "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey",
            "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez",
            "James", "Watson", "Brooks", "Kelly", "Sanders", "Bennett", "Wood", "Barnes", "Ross", "Henderson",
            "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler",
            "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Reynolds"
        ]

        users_list = []
        user_map = {1: "John Doe", 2: "Sarah Connor"}
        for i in range(3, 103):
            fn = first_names[(i - 3) % len(first_names)]
            ln = last_names[(i - 3) % len(last_names)]
            full_name = f"{fn} {ln}"
            email = f"{fn.lower()}.{ln.lower()}{i}@techcorp.io" if i % 2 == 0 else f"{fn.lower()}.{ln.lower()}{i}@example.com"
            created_days = random.randint(5, 85)
            user_obj = User(
                id=i,
                name=full_name,
                email=email,
                password=default_pw,
                role="customer",
                created_at=now - timedelta(days=created_days)
            )
            users_list.append(user_obj)
            user_map[i] = full_name

        db.add_all(users_list)
        db.commit()

        print("Seeding exactly 20 high-end enterprise catalog products...")
        products_data = [
            ("HelpFlow Pro Laptop (16-inch)", "16-inch Retina Display, 32GB RAM, 1TB SSD, Neural Processing Unit.", 1499.99, 15),
            ("Wireless Noise-Cancelling Headphones", "Active noise reduction, 40-hour battery life, ergonomic memory foam.", 249.50, 42),
            ("Mechanical Ergonomic Keyboard", "RGB backlit, tactile mechanical switches, padded magnetic wrist rest included.", 129.99, 28),
            ("Ultra-Wide 34-Inch Curved Monitor", "4K UHD resolution, 144Hz refresh rate, 99% DCI-P3 color gamut, USB-C 90W hub built-in.", 699.00, 8),
            ("HelpFlow Studio 4K Webcam", "Ultra HD 4K autofocus sensor, dual AI noise-filtering microphones, privacy shutter.", 179.99, 55),
            ("ProStudio USB-C Condenser Microphone", "Cardioid pickup pattern, zero-latency headphone monitoring, boom arm mount adapter.", 149.00, 34),
            ("HelpFlow Pro Thunderbolt 4 Dock", "Dual 4K 60Hz video out, 96W power delivery, 2.5GbE LAN port, 4x USB-A 3.2 ports.", 229.99, 19),
            ("Ergonomic Vertical Wireless Mouse", "60-degree natural hand posture design, 4000 DPI high-precision optical sensor, multi-device sync.", 89.99, 60),
            ("32GB DDR5 6000MHz RAM Kit (2x16GB)", "High-speed low-latency DDR5 memory with custom aluminum heat spreaders and XMP 3.0 profile.", 159.99, 25),
            ("2TB NVMe M.2 Gen4 SSD", "7400 MB/s sequential read speed, graphene copper heat sink included, 5-year endurance rating.", 189.99, 38),
            ("HelpFlow Aluminum Laptop Stand", "Heavy-duty anodized aluminum space gray finish, 360-degree swivel, ergonomic eye-level adjustment.", 59.99, 85),
            ("Smart RGB Desk Light Bar", "Ambient bias lighting with auto color temperature adjustment and touch dimmer controls.", 79.50, 47),
            ("100W GaN 4-Port USB-C Fast Charger", "Gallium Nitride high-efficiency charging station, dual USB-C PD and dual USB-A quick charge ports.", 69.99, 110),
            ("Enterprise Wi-Fi 6E Tri-Band Mesh Router", "AXE5400 multi-gigabit wireless router with WPA3 enterprise security and dedicated 6GHz backhaul.", 299.00, 12),
            ("HelpFlow Custom PBT Double-Shot Keycap Set", "Textured PBT material resistant to shine, cherry profile, compatible with MX switches.", 49.99, 70),
            ("Premium Acoustic Desk Partition Panel", "Sound-absorbing PET felt desktop divider, tool-free desk clamp installation, 24x30 inches.", 119.00, 22),
            ("HelpFlow Portable 15.6-Inch OLED Monitor", "Ultra-slim 1080p OLED self-lit pixel display, single USB-C cable pass-through power and video.", 349.99, 14),
            ("Wireless Qi Fast Charging Large Mousepad", "Micro-textured water-resistant cloth surface with integrated 15W Qi wireless fast charging zone.", 64.99, 50),
            ("HelpFlow Pro External GPU Enclosure (eGPU)", "Thunderbolt 3/4 PCIe expansion chassis with 650W ATX power supply supporting full-length desktop GPUs.", 399.00, 6),
            ("High-Performance Carbon Nanotube Thermal Paste", "Non-conductive 14.2 W/mK thermal compound with spatula application tool for CPU and GPU maintenance.", 18.99, 150)
        ]
        
        db.add_all([
            Product(id=idx+1, name=p[0], description=p[1], price=p[2], stock=p[3])
            for idx, p in enumerate(products_data)
        ])
        db.commit()

        print("Seeding exactly 50 realistic customer orders...")
        orders_list = []
        
        # Core pre-existing orders for sandbox evaluation
        orders_list.append(Order(
            id="ORD1005",
            user_id=1,
            customer_name="John Doe",
            status="DELAYED",
            expected_delivery=(now + timedelta(days=3)).strftime("%Y-%m-%d"),
            courier="FedEx Priority Express",
            tracking_number="FDX-89231405-US",
            created_at=now - timedelta(days=4)
        ))
        orders_list.append(Order(
            id="ORD1008",
            user_id=1,
            customer_name="John Doe",
            status="SHIPPED",
            expected_delivery=(now + timedelta(days=1)).strftime("%Y-%m-%d"),
            courier="DHL Express",
            tracking_number="DHL-74920183-US",
            created_at=now - timedelta(days=2)
        ))

        statuses = ["PROCESSING", "SHIPPED", "DELIVERED", "DELAYED"]
        status_weights = [0.25, 0.35, 0.30, 0.10]
        couriers = ["FedEx Priority Express", "DHL Express", "UPS Ground", "USPS Priority Mail"]
        
        for ord_num in range(1001, 1051):
            if ord_num in [1005, 1008]:
                continue
            uid = random.randint(1, 102)
            cname = user_map.get(uid, "Customer Account")
            chosen_status = random.choices(statuses, weights=status_weights, k=1)[0]
            chosen_courier = random.choice(couriers)
            
            if chosen_status == "DELIVERED":
                days_offset = random.randint(-15, -1)
                created_offset = days_offset - random.randint(3, 7)
            elif chosen_status == "DELAYED":
                days_offset = random.randint(1, 5)
                created_offset = -random.randint(5, 10)
            elif chosen_status == "SHIPPED":
                days_offset = random.randint(1, 4)
                created_offset = -random.randint(2, 5)
            else: # PROCESSING
                days_offset = random.randint(4, 7)
                created_offset = -random.randint(0, 1)

            orders_list.append(Order(
                id=f"ORD{ord_num}",
                user_id=uid,
                customer_name=cname,
                status=chosen_status,
                expected_delivery=(now + timedelta(days=days_offset)).strftime("%Y-%m-%d"),
                courier=chosen_courier,
                tracking_number=f"TRK-{ord_num}-{random.randint(1000,9999)}US",
                created_at=now + timedelta(days=created_offset)
            ))

        db.add_all(orders_list)
        db.commit()

        print("Seeding exactly 25 realistic customer support tickets...")
        tickets_data = [
            ("TCK-101", 1, "Inquiry regarding billing breakdown and carrier tracking for Order ORD1005.", "OPEN", -2),
            ("TCK-102", 3, "Order ORD1003 is marked DELAYED. Please expedite shipping or provide carrier tracking update.", "IN_PROGRESS", -1),
            ("TCK-103", 4, "Requesting Return Merchandise Authorization (RMA) for HelpFlow Pro Laptop due to keyboard switch preference.", "OPEN", -1),
            ("TCK-104", 5, "Question regarding 10% restocking fee exception for unopened Ultra-Wide 34-Inch Monitor.", "RESOLVED", -5),
            ("TCK-105", 6, "Wireless Noise-Cancelling Headphones left ear cup audio dropout after firmware update.", "IN_PROGRESS", -3),
            ("TCK-106", 7, "Inquiry about corporate bulk discount pricing for 20 HelpFlow Pro Laptops and Thunderbolt Docks.", "RESOLVED", -10),
            ("TCK-107", 8, "Order ORD1012 expected delivery passed yesterday. Requesting priority shipment check.", "OPEN", 0),
            ("TCK-108", 9, "HelpFlow Studio 4K Webcam USB-C connection disconnects intermittently during high-bandwidth conference calls.", "IN_PROGRESS", -2),
            ("TCK-109", 10, "Need replacement USB-C to Thunderbolt cable for HelpFlow Pro Dock under standard 1-year warranty.", "RESOLVED", -8),
            ("TCK-110", 11, "Order ORD1016 arrived with outer carton indentation. Inspecting internal monitor panel for screen uniformity.", "OPEN", -1),
            ("TCK-111", 12, "How do I modify shipping destination address for Order ORD1018 before it transitions to SHIPPED status?", "RESOLVED", -4),
            ("TCK-112", 13, "Requesting commercial VAT invoice breakdown and tax registration details for accounting department.", "RESOLVED", -7),
            ("TCK-113", 14, "Ergonomic Vertical Wireless Mouse scroll wheel tension adjustment screw inquiry.", "OPEN", 0),
            ("TCK-114", 15, "Order ORD1023 status shows DELAYED due to severe winter weather in transit hub. Requesting updated carrier ETA.", "IN_PROGRESS", -2),
            ("TCK-115", 16, "HelpFlow Aluminum Laptop Stand swivel mechanism tension calibration guide needed.", "RESOLVED", -6),
            ("TCK-116", 17, "32GB DDR5 RAM Kit XMP profile stability verification on enterprise workstation motherboard.", "RESOLVED", -9),
            ("TCK-117", 18, "Order ORD1028 tracking number from carrier shows 'Label Created not yet picked up' for 48 hours.", "OPEN", -1),
            ("TCK-118", 19, "Requesting advanced warranty replacement for 100W GaN USB-C Fast Charger port 2 intermittent power drop.", "IN_PROGRESS", -3),
            ("TCK-119", 20, "Can I return opened Mechanical Ergonomic Keyboard within 30 days without restocking fee if upgrading to custom PBT set?", "RESOLVED", -5),
            ("TCK-120", 21, "Order ORD1032 fulfillment confirmation email receipt requested for reimbursement report.", "RESOLVED", -12),
            ("TCK-121", 22, "Smart RGB Desk Light Bar ambient light sensor sensitivity calibration adjustment procedure.", "OPEN", 0),
            ("TCK-122", 23, "Enterprise Wi-Fi 6E Mesh Router satellite unit backhaul channel selection optimization question.", "IN_PROGRESS", -2),
            ("TCK-123", 24, "Order ORD1038 delayed by carrier. Requesting credit refund for $24.99 Priority Overnight expedited shipping charge.", "RESOLVED", -4),
            ("TCK-124", 25, "Portable 15.6-Inch OLED Monitor USB-C pass-through power requirements for dual monitor daisy chaining.", "OPEN", -1),
            ("TCK-125", 1, "Urgent follow-up: Order #ORD1005 shipping delay investigation and priority logistics team dispatch status.", "IN_PROGRESS", 0)
        ]

        db.add_all([
            Ticket(id=t[0], user_id=t[1], issue=t[2], status=t[3], created_at=now + timedelta(days=t[4]))
            for t in tickets_data
        ])
        db.commit()

        print("Seeding realistic multi-turn conversation logs...")
        conversations_data = [
            (
                1,
                "Where is my order #ORD1005? And what is causing the delay?",
                "I have located your order details above. Your shipment `#ORD1005` via **FedEx Priority Express** is currently marked as **DELAYED**, with an updated estimated delivery date of **2026-07-20**.\n\nOur carrier logs indicate a temporary weather delay at the regional sorting hub. You can use the suggested actions above to track your shipment or open a priority logistics ticket.",
                '[{"tool_name": "CheckOrderTool", "arguments": {"order_id": "ORD1005"}, "result": {"found": true, "order_id": "ORD1005", "customer_name": "John Doe", "status": "DELAYED", "expected_delivery": "2026-07-20", "courier": "FedEx Priority Express", "tracking_number": "FDX-89231405-US"}}]',
                -3
            ),
            (
                1,
                "Yes, please create a priority support ticket right now complaining about the shipping delay.",
                "I have logged a priority customer support ticket (`#TCK-101`) with our logistics team to expedite handling of your shipment right away (see verification card above).\n\nOur logistics operations team monitors this queue 24/7 and will follow up with an update within 12 hours.",
                '[{"tool_name": "CreateTicketTool", "arguments": {"issue": "Inquiry regarding billing breakdown and carrier tracking for Order ORD1005.", "user_id": 1}, "result": {"success": true, "ticket_id": "TCK-101", "status": "OPEN", "issue": "Inquiry regarding billing breakdown and carrier tracking for Order ORD1005."}}]',
                -3
            ),
            (
                3,
                "Can you check stock and pricing for your laptops?",
                "### Product Search Results for 'laptops':\n- **HelpFlow Pro Laptop (16-inch)** — `$1499.99` (15 in stock)\n  *16-inch Retina Display, 32GB RAM, 1TB SSD, Neural Processing Unit.*\n\nWe currently have 15 units available for same-day shipping. Would you like me to check delivery estimates or compatibility specifications?",
                '[{"tool_name": "ProductSearchTool", "arguments": {"query": "laptops"}, "result": {"found": true, "query": "laptops", "products": [{"id": 1, "name": "HelpFlow Pro Laptop (16-inch)", "description": "16-inch Retina Display, 32GB RAM, 1TB SSD, Neural Processing Unit.", "price": 1499.99, "stock": 15}]}}]',
                -2
            ),
            (
                4,
                "What is your refund policy if I open the box but want to return an item within 30 days?",
                "### Retrieved Policy Information:\nAccording to our **Refund and Return Policy (`refund_policy.md`)**:\n\n- **30-Day Return Window**: We offer a comprehensive 30-day return window from the delivery date.\n- **Opened but Unused Items**: Items that have been opened from their original packaging but remain unused and in mint condition are subject to a standard **10% restocking fee** to cover technical inspection and re-packaging.\n- **Unopened Items**: Qualify for a 100% full refund with zero restocking fee.\n\nWould you like me to generate a pre-paid Return Merchandise Authorization (RMA) label for one of your orders?",
                "[]",
                -1
            ),
            (
                6,
                "Do your noise cancelling headphones come with a manufacturer warranty?",
                "### Retrieved Policy Information:\nAccording to our **Limited Manufacturer Warranty Policy (`warranty_policy.md`)**:\n\nAll electronic products sold through HelpFlow AI, including the **Wireless Noise-Cancelling Headphones**, include a **1-Year Limited Manufacturer Warranty** from your original purchase date.\n\n**Coverage Includes**:\n- Internal hardware failures and processor faults.\n- Battery degradation exceeding 40% loss of maximum charge capacity within the first 12 months.\n- Manufacturing defects in charging ports, buttons, or active noise reduction sensors.\n\nIf you ever experience a covered defect, I can automatically generate a warranty repair ticket (`TCK-xxx`) and issue a prepaid return label.",
                "[]",
                -1
            )
        ]

        db.add_all([
            ChatHistory(
                user_id=c[0],
                message=c[1],
                response=c[2],
                tools_called=c[3],
                timestamp=now + timedelta(days=c[4])
            )
            for c in conversations_data
        ])
        db.commit()

        print("Building local FAISS semantic RAG index from knowledge base documents...")
        vs = get_vector_store()
        vs.build_index()

        print("Database initialized successfully with 102 users, 50 orders, 25 tickets, 20 products, and conversation logs.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
