from app.database.connection import engine, SessionLocal, Base
from app.models.user import User
from app.models.order import Order
from app.models.ticket import Ticket
from app.models.product import Product
from app.utils.auth import hash_password

def init_db():
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Seed users if not exists
        if not db.query(User).filter(User.email == "customer@example.com").first():
            print("Seeding customer user...")
            customer = User(
                id=1,
                name="John Doe",
                email="customer@example.com",
                password=hash_password("password"),
                role="customer"
            )
            db.add(customer)

        if not db.query(User).filter(User.email == "admin@example.com").first():
            print("Seeding admin user...")
            admin = User(
                id=2,
                name="Sarah Admin",
                email="admin@example.com",
                password=hash_password("admin"),
                role="admin"
            )
            db.add(admin)

        # Seed orders if not exists
        if not db.query(Order).filter(Order.id == "ORD1005").first():
            print("Seeding order ORD1005...")
            order1 = Order(
                id="ORD1005",
                user_id=1,
                customer_name="John Doe",
                status="DELAYED",
                expected_delivery="2026-07-20"
            )
            db.add(order1)

        if not db.query(Order).filter(Order.id == "ORD1008").first():
            print("Seeding order ORD1008...")
            order2 = Order(
                id="ORD1008",
                user_id=1,
                customer_name="John Doe",
                status="SHIPPED",
                expected_delivery="2026-07-17"
            )
            db.add(order2)

        # Seed initial ticket
        if not db.query(Ticket).filter(Ticket.id == "TCK-101").first():
            print("Seeding ticket TCK-101...")
            ticket1 = Ticket(
                id="TCK-101",
                user_id=1,
                issue="Inquiry regarding billing breakdown for Order ORD1005.",
                status="OPEN"
            )
            db.add(ticket1)

        # Seed products if empty
        if db.query(Product).count() == 0:
            print("Seeding sample products...")
            products = [
                Product(name="AgentAssist Pro Laptop", description="16-inch Retina Display, 32GB RAM, 1TB SSD, Neural Processing Unit.", price=1499.99, stock=15),
                Product(name="Wireless Noise-Cancelling Headphones", description="Active noise reduction, 40-hour battery life, ergonomic memory foam.", price=249.50, stock=42),
                Product(name="Mechanical Ergonomic Keyboard", description="RGB backlit, tactile switches, wrist rest included.", price=129.99, stock=28),
                Product(name="Ultra-Wide 34-Inch Monitor", description="4K resolution, 144Hz refresh rate, USB-C hub built-in.", price=699.00, stock=8)
            ]
            db.add_all(products)

        db.commit()
        print("Database initialized and seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
