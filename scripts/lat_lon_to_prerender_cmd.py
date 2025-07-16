# Copyright (c) 2025 by OpenTier GmbH
# SPDX‑FileCopyrightText: 2025 OpenTier GmbH
# SPDX‑License‑Identifier: MIT

# This file is part of OpenTier.

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import math


def lat_lon_to_tile(lat, lon, zoom):
    n = 2**zoom
    x_tile = n * ((lon + 180) / 360)
    lat_rad = math.radians(lat)
    y_tile = (
        n * (1 - (math.log(math.tan(lat_rad) + 1 / math.cos(lat_rad)) / math.pi)) / 2
    )
    return int(x_tile), int(y_tile)


for z in [15, 16, 17, 18]:
    zoom = z  # Specify the zoom level
    min_lat, min_lon = 50.75134, 7.06073
    max_lat, max_lon = 50.71695, 7.15206

    min_x, min_y = lat_lon_to_tile(min_lat, min_lon, zoom)
    max_x, max_y = lat_lon_to_tile(max_lat, max_lon, zoom)

    print(
        f"render_list -a -n 8 -z {zoom} -Z {zoom} -x {min_x} -X {max_x} -y {min_y} -Y {max_y}"
    )
