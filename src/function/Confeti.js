import confetti from 'canvas-confetti'

const AnimacionModulo = {
    lanzarConfeti: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#10B981", "#10B981"],
      })
    },
  }
  

export default  AnimacionModulo