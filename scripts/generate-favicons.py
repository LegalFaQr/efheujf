from PIL import Image, ImageDraw, ImageFont
import shutil
import os

# Base resolution for high-quality supersampled rasterization
MASTER_SIZE = 512
NAVY = (16, 40, 81, 255)      # #102851
LIME = (148, 184, 98, 255)    # #94b862
WHITE = (255, 255, 255, 255)  # #ffffff

def create_master_icon(size=MASTER_SIZE):
    img = Image.new('RGBA', (size, size), NAVY)
    draw = ImageDraw.Draw(img)

    font_path = r'C:\Windows\Fonts\georgiab.ttf'
    if not os.path.exists(font_path):
        font_path = r'C:\Windows\Fonts\georgia.ttf'
    
    font = ImageFont.truetype(font_path, 350)

    bbox = draw.textbbox((0, 0), 'K', font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Center text horizontally and position with room for the lime accent bar
    x = (size - text_w) / 2 - bbox[0]
    y = (size - text_h) / 2 - bbox[1] - 34
    draw.text((x, y), 'K', fill=WHITE, font=font)

    # Lime accent bar with rounded ends
    line_y = 428
    line_start_x = 144
    line_end_x = 368
    stroke_w = 32

    draw.line([(line_start_x, line_y), (line_end_x, line_y)], fill=LIME, width=stroke_w)
    draw.ellipse([line_start_x - stroke_w/2, line_y - stroke_w/2, line_start_x + stroke_w/2, line_y + stroke_w/2], fill=LIME)
    draw.ellipse([line_end_x - stroke_w/2, line_y - stroke_w/2, line_end_x + stroke_w/2, line_y + stroke_w/2], fill=LIME)

    return img

def main():
    dist_dir = 'dist'
    master = create_master_icon()

    # 1. Generate 48x48 PNG (Google Search primary)
    p48 = master.resize((48, 48), Image.Resampling.LANCZOS)
    p48.save(os.path.join(dist_dir, 'favicon-48x48.png'), 'PNG', optimize=True)

    # 2. Generate 96x96 PNG
    p96 = master.resize((96, 96), Image.Resampling.LANCZOS)
    p96.save(os.path.join(dist_dir, 'favicon-96x96.png'), 'PNG', optimize=True)

    # 3. Generate 192x192 PNG (Android / PWA)
    p192 = master.resize((192, 192), Image.Resampling.LANCZOS)
    p192.save(os.path.join(dist_dir, 'favicon-192x192.png'), 'PNG', optimize=True)

    # 4. Generate 180x180 Apple Touch Icon
    p180 = master.resize((180, 180), Image.Resampling.LANCZOS)
    p180.save(os.path.join(dist_dir, 'apple-touch-icon.png'), 'PNG', optimize=True)

    # 5. Generate multi-resolution favicon.ico (16, 32, 48)
    p16 = master.resize((16, 16), Image.Resampling.LANCZOS)
    p32 = master.resize((32, 32), Image.Resampling.LANCZOS)
    
    # Save multi-size ICO
    ico_path = os.path.join(dist_dir, 'favicon.ico')
    # Use 48x48 base image and append 16 and 32
    p48.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

    # Mirror root assets for static host / GitHub Pages fallback
    for name in ['favicon.ico', 'favicon.svg', 'favicon-48x48.png', 'apple-touch-icon.png']:
        src = os.path.join(dist_dir, name)
        if os.path.exists(src):
            shutil.copy2(src, name)

    print("Successfully generated all favicon assets.")

if __name__ == '__main__':
    main()
