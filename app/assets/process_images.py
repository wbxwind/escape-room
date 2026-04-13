import os
from PIL import Image, ImageChops

def trim_black_bars(im, threshold=15):
    """
    Trims black bands from the top and bottom of an image.
    Uses ImageChops.difference to find the bounding box of non-black content.
    """
    # Convert to RGB to ensure black is (0,0,0)
    rgb_im = im.convert('RGB')
    bg = Image.new('RGB', rgb_im.size, (0, 0, 0))
    diff = ImageChops.difference(rgb_im, bg)
    
    # Increase contrast of the difference to catch near-black pixels
    # add(a, b, scale, offset)
    diff = ImageChops.add(diff, diff, 1.0, -threshold)
    
    bbox = diff.getbbox()
    if bbox:
        # Crop ONLY top and bottom. Keep full width.
        # bbox is (left, upper, right, lower)
        return im.crop((0, bbox[1], im.size[0], bbox[3]))
    return im

def process_and_split(input_path, output_name_1, output_name_2):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    print(f"Loading {input_path}...")
    im = Image.open(input_path)
    
    # 1. Remove black bands from top and bottom
    trimmed = trim_black_bars(im)
    print(f"  Trimmed dimensions: {trimmed.size}")
    
    # 2. Split vertically in half
    width, height = trimmed.size
    half_width = width // 2
    
    left = trimmed.crop((0, 0, half_width, height))
    right = trimmed.crop((half_width, 0, width, height))
    
    # 3. Save
    base_dir = os.path.dirname(input_path)
    left.save(os.path.join(base_dir, output_name_1), quality=95)
    right.save(os.path.join(base_dir, output_name_2), quality=95)
    print(f"  Created: {output_name_1} ({left.size})")
    print(f"  Created: {output_name_2} ({right.size})")

if __name__ == "__main__":
    # Ensure relative paths work from project root
    process_and_split("app/assets/cooling_vent_security_terminal.jpg", "cooling_vent.jpg", "security_terminal.jpg")
    process_and_split("app/assets/maintenance_hatch_server_room.jpg", "maintenance_hatch.jpg", "server_room.jpg")
