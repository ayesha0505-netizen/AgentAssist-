import os
from PIL import Image

def make_dark_mode_logo():
    in_path = r"c:\Users\naaza\AgentAssist\frontend\public\helpflow-logo.png"
    out_path = r"c:\Users\naaza\AgentAssist\frontend\public\helpflow-logo-dark.png"
    
    if not os.path.exists(in_path):
        print(f"Error: {in_path} not found")
        return
        
    img = Image.open(in_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > 10:
                # Calculate brightness and color saturation
                brightness = (r + g + b) / 3.0
                # If pixel is dark navy blue or black (like 'Help' or 'AUTONOMOUS SUPPORT...')
                # e.g., brightness < 110 or (b > r and brightness < 140 and g < 110)
                if brightness < 125 and max(r, g, b) < 160:
                    # Scale to white/light slate while keeping alpha for smooth anti-aliasing
                    # If it's a dark pixel, map it to #ffffff or #e0e2eb
                    factor = min(1.0, (140 - brightness) / 100.0)
                    new_r = int(r + (255 - r) * factor)
                    new_g = int(g + (255 - g) * factor)
                    new_b = int(b + (255 - b) * factor)
                    pixels[x, y] = (new_r, new_g, new_b, a)
                    
    img.save(out_path, "PNG")
    print(f"Saved dark mode logo to: {out_path}")

if __name__ == "__main__":
    make_dark_mode_logo()
