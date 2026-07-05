from collections import Counter
import sys

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 countSpots.py <target.geojson>")
        sys.exit(1)

    path = sys.argv[1]

with open(path, 'r', encoding='utf-8') as f:
    total = f.read()
    freq = total.count('geometry')

print(freq)