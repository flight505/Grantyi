uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;

varying vec2 vUv;
varying vec4 vPosition;

varying vec3 vColor;

varying vec3 vNormal;


float PI = 3.141592653589793238;



void main()	{
	vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

	vec3 light = vec3(0.0);
	vec3 skyColor = vec3(1.000, 1.000, 0.547);
	vec3 groundColor = vec3(0.562, 0.275, 0.111);

	
	vec3 lightDirection = normalize(vec3(0.0, -1.0, -0.2)); // directional light direction (top down)

	light += dot(lightDirection, vNormal);

	light = mix(skyColor, groundColor, dot(lightDirection, vNormal));

	gl_FragColor = vec4(vColor, 1.0);
	gl_FragColor = vec4(light*vColor, 1.0);

}