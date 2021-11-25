import React, { Component } from 'react'
import Particles from "react-tsparticles"


class ParticleSettings extends Component {
    render() {

        return (

            <div>
                <Particles
                    height="1000px"
                    width="100vm"
                    id="ts-paricles"
                    options={{
                        background: {
                            color: {
                                value: "black"
                            },
                        },
                        fpslimit: 60,
                        interactivity: {
                            detect_on: 'canvas',
                            events: {
                                onClick: {
                                    enable: 'true',
                                    mode: 'push'
                                },
                                onHover: {
                                    enable: 'true',
                                    mode: 'repulse'
                                },
                                resize: 'true',
                            },
                            modes: {
                                bubble: {
                                    distance: 400,
                                    duration: 2,
                                    opacity: 0.8,
                                    size: 40,
                                },
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.8,
                                },
                            },
                        },


                        particles: {
                            color: {
                                value: "#c49e12",
                            },
                            links: {
                                color: "#12c4b0",
                                distance: 200,
                                enable: true,
                                opacity: 0.5,
                                width: 2,
                            },
                            collisions: {
                                enable: true,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outMode: "bounce",
                                random: false,
                                speed: 3,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    value_area: 800,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "square",
                            },
                            size: {
                                random: true,
                                value: 5,
                            },
                        }
                    }
                    }
                />
            </div>
        )


    }

}

export default ParticleSettings;