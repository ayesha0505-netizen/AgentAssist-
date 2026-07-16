import os
import sys
from PIL import Image

def remove_bg_and_crop():
    input_path = r"c:\Users\naaza\.gemini\antigravity\brain\0652142c-d967-4824-984d-85b0607a5191\media__1784164555054.png"
    out_full = r"c:\Users\naaza\AgentAssist\frontend\public\helpflow-logo.png"
    out_icon = r"c:\Users\naaza\AgentAssist\frontend\public\helpflow-icon.png"

    if not os.path.exists(input_path):
        print(f"Error: input image not found at {input_path}")
        return

    print("Loading image...")
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    print(f"Image loaded: {width}x{height}")

    # Try using rembg for neural background removal first
    try:
        from rembg import remove
        print("Using rembg for neural background removal...")
        transparent_full = remove(img)
    except ImportError:
        print("rembg not installed. Using flood-fill & color thresholding algorithm...")
        # Since background is light (white / vignette gradient from corners),
        # let's do BFS / flood-fill from all 4 corners and borders where pixel is light
        transparent_full = img.copy()
        pixels = transparent_full.load()
        
        # We also check RGB lightness. The background in this logo is white/light cyan-grey vignette.
        # The logo text 'Help' is very dark blue (#1b3a57), 'FlowAI' is cyan-blue gradient, icon is cyan/blue gradient.
        # Let's do flood fill from (0,0), (width-1, 0), (0, height-1), (width-1, height-1)
        # plus any outer border pixels that have brightness > 220.
        from collections import deque
        visited = set()
        queue = deque()
        
        # Add border pixels that are light to queue
        for x in range(width):
            for y in [0, height-1]:
                r, g, b, a = pixels[x, y]
                if r > 210 and g > 210 and b > 210:
                    queue.append((x, y))
                    visited.add((x, y))
        for y in range(height):
            for x in [0, width-1]:
                r, g, b, a = pixels[x, y]
                if r > 210 and g > 210 and b > 210 and (x, y) not in visited:
                    queue.append((x, y))
                    visited.add((x, y))

        while queue:
            x, y = queue.popleft()
            # Set transparent
            pixels[x, y] = (255, 255, 255, 0)
            
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    nr, ng, nb, na = pixels[nx, ny]
                    # If neighbor is also light background (high brightness and low saturation/near grey-white)
                    # Let's check:
                    brightness = (nr + ng + nb) / 3.0
                    max_diff = max(abs(nr-ng), abs(ng-nb), abs(nr-nb))
                    # Background pixels in vignette are light (brightness > 225) or (brightness > 210 and max_diff < 20)
                    if brightness > 225 or (brightness > 200 and max_diff < 25):
                        visited.add((nx, ny))
                        queue.append((nx, ny))

        # Additional clean up of isolated white/light pixels or anti-aliasing edges
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if a > 0:
                    brightness = (r + g + b) / 3.0
                    max_diff = max(abs(r-g), abs(g-b), abs(r-b))
                    # If very light grey/white background inside isolated pockets (like inside 'e', 'p', 'o', 'A')
                    if brightness > 238 and max_diff < 15:
                        pixels[x, y] = (255, 255, 255, 0)
                    elif brightness > 220 and max_diff < 10:
                        # soft alpha transition for anti-aliasing edge
                        alpha = int((238 - brightness) / 18.0 * 255)
                        if alpha < 0: alpha = 0
                        pixels[x, y] = (r, g, b, min(a, alpha))

    # Save full transparent logo
    os.makedirs(os.path.dirname(out_full), exist_ok=True)
    transparent_full.save(out_full, "PNG")
    print(f"Saved full transparent logo to: {out_full}")

    # Now let's create cropped version of just the Icon (on the left)
    # Let's find the bounding box of non-transparent pixels on the left portion (e.g. 0 to width*0.32)
    bbox_left = int(width * 0.32)
    icon_crop = transparent_full.crop((0, 0, bbox_left, height))
    # Get exact bbox of non-zero alpha in icon_crop
    alpha_channel = icon_crop.split()[3]
    bbox = alpha_channel.getbbox()
    if bbox:
        icon_cropped = icon_crop.crop(bbox)
        # add a small margin (padding) around icon
        pad = 10
        iw, ih = icon_cropped.size
        padded_icon = Image.new("RGBA", (iw + pad*2, ih + pad*2), (0, 0, 0, 0))
        padded_icon.paste(icon_cropped, (pad, pad))
        padded_icon.save(out_icon, "PNG")
        print(f"Saved cropped icon logo to: {out_icon}")
    else:
        print("Could not detect bbox for icon crop.")

if __name__ == "__main__":
    remove_bg_and_crop()
